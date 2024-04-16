import PocketBase from "pocketbase";
const NEXT_PUBLIC_POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const pb = new PocketBase(`${NEXT_PUBLIC_POCKETBASE_URL}`);
import { cookies } from "next/headers";

export async function createPBChat(user1: string, user2: string) {
    try {
        const data = {
            users: [user1, user2],
        };

        const records = await pb.collection("chats").getFullList();
        const filteredChat = records.filter(
            (chat) => chat.users.includes(user1) && chat.users.includes(user2),
        );

        if (filteredChat.length > 0) {
            return filteredChat[0];
        }

        const newChat = await pb.collection("chats").create(data);

        await createNewChatroomNotification(user1, user2, newChat.id);
        console.log(newChat);
        return newChat;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function createPBMessage(
    sender: string,
    receiver: string,
    content: string,
    chatId: string,
) {
    try {
        const record = await pb.collection("messages").create({
            sender: sender,
            receiver: receiver,
            content: content,
            date: new Date().toISOString(),
        });

        const currentChatState = await pb.collection("chats").getOne(chatId);
        await pb
            .collection("chats")
            .update(chatId, { messages: [...currentChatState.messages, record.id] });
        await createNewMessageNotification(sender, receiver, chatId);

        return record;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

//current implementation of delete method for PB
export async function deletePBChat(chatId: string) {
    try {
        let res = await pb.collection("chats").delete(chatId);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}
//end of current change

export async function getPBChats(user: string) {
    try {
        console.log("user", user);
        const chats = await pb.collection("chats").getFullList({
            expand: "users",
        });
        const filteredChats = chats.filter((chat) => chat.users.includes(user));

        console.log(filteredChats);
        return filteredChats;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function getSinglePBChat(id: string) {
    try {
        const chat = await pb.collection("chats").getOne(id, {
            expand: "messages,users",
        });

        return chat;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function signIn(method: string, formData: FormData) {
    if (method === "credentials") {
        const isValid = await validateCredentials(formData);

        console.log("isValid stiff", isValid);
        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        const tmp = isValid.record.firstName;

        cookies().set("id", isValid.record.id);
        cookies().set("firstName", isValid.record.firstName);
        cookies().set("lastName", isValid.record.lastName);
        cookies().set("email", isValid.record.email);
        cookies().set("year", isValid.record.year);
        cookies().set("dateJoined", isValid.record.created);
        cookies().set("avatar", isValid.record.avatar);
    }
}

async function validateCredentials(formData: FormData) {
    try {
        const email = formData.get("email");
        const password = formData.get("password");
        if (typeof email === "string" && typeof password === "string") {
            const user = await pb
                .collection("users")
                .authWithPassword(email, password);
            return user;
        }

        throw new Error("Invalid credentials");
    } catch (error) {
        console.error("Error logging in:", error);
        return null;
    }
}

export async function editUser(userId: string, data: any) {
    try {
        let user = await pb.collection("users").update(userId, data);
        console.log("user", user);

        cookies().set("id", user.id);
        cookies().set("firstName", user.firstName);
        cookies().set("lastName", user.lastName);
        cookies().set("email", user.email);
        cookies().set("year", user.year);
        cookies().set("dateJoined", user.created);
        cookies().set("avatar", user.avatar);

        return user;
    } catch (error) {
        console.error("Error logging in:", error);
        return null;
    }
}

export async function createAccount(formData: FormData): Promise<void> {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    let user;

    if (
        typeof email === "string" &&
        typeof password === "string" &&
        typeof confirmPassword === "string" &&
        typeof firstName === "string" &&
        typeof lastName === "string"
    ) {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        if (email.split("@")[1] !== "vanderbilt.edu") {
            throw new Error("Email must be a valid vanderbilt email");
        }

        user = await pb.collection("users").create({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
            passwordConfirm: confirmPassword,
            emailVisibility: true,
        });
    }

    if (!user) {
        throw new Error("Error creating account");
    }

    await signIn("credentials", formData);
}

export async function getPBListings() {
    try {
        const records = await pb.collection("listings").getFullList({
            sort: "-created",
        });

        return records;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function getMyPBListings(id: string) {
    try {
        const listings = await pb.collection("users").getOne(id, {
            expand: "listings",
        });

        return listings?.expand?.listings;
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return error.message;
        }
    }
}
export async function getMySavedPBListings(id: string) {
    try {
        const listings = await pb.collection("users").getOne(id, {
            expand: "saved",
        });

        return listings?.expand?.saved;
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function getIfPBListingsSaved(userId: string, listingId: string) {
    try {
        const user = await pb.collection("users").getOne(userId);
        const saved = user.saved ? user.saved : [];
        return saved.includes(listingId);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function addToMySavedPBListings(userId: string, listingId: string) {
    try {
        const user = await pb.collection("users").getOne(userId);
        const savedNew = user.saved ? [...user.saved, listingId] : [listingId];
        const res = await pb.collection("users").update(userId, { saved: savedNew });

        return res;
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function removeMySavedPBListings(userId: string, listingId: string) {
    try {
        const user = await pb.collection("users").getOne(userId);
        const savedNew = user.saved.filter((id: string) => id !== listingId);
        const res = await pb.collection("users").update(userId, { saved: savedNew });

        return res;
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return error.message;
        }
    }
}





export async function createPBListing(data: any) {
    try {
        let tmp = data.image.get("image");
        data.image = tmp;

        const newListing = await pb.collection("listings").create(data);
        const user = await pb.collection("users").getOne(data.user);
        const listings = user.listings
            ? [...user.listings, newListing.id]
            : [newListing.id];
        await pb.collection("users").update(data.user, { listings });

        return newListing;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function deletePBListing(userId: string, listingId: string) {
    try {
        let listing = await pb.collection("listings").getOne(listingId);
        if (listing.user !== userId) {
            throw new Error("You do not have permission to delete this listing");
        }
        let res = await pb.collection("listings").delete(listingId);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function editPBListing(
    userId: string,
    listingId: string,
    data: any,
) {
    try {
        let listing = await pb.collection("listings").getOne(listingId);
        if (listing.user !== userId) {
            throw new Error("You do not have permission to delete this listing");
        }
        let res = await pb.collection("listings").update(listingId, data);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function handlePBReport(listingId: string, data: any) {
    try {
        let listing = await pb.collection("listings").getOne(listingId);
        if (listing.times_reported >= 4) {
            let del = await pb.collection("listings").delete(listingId);
            await createDeletedListingNotification(listing.user, listing);
            return del;
        }
        let res = await pb.collection("listings").update(listingId, data);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

async function createDeletedListingNotification(userId: string, listing: any) {
    try {
        const data = {
            text: `Your listing ${listing?.title} has been deleted due to multiple reports.`,
            hasViewed: false,
        };
        const notification = await pb.collection("notifications").create(data);
        const user = await pb.collection("users").getOne(listing.user);
        const userUpdate = await pb.collection("users").update(listing.user, {
            notifications: [...user.notifications, notification.id],
        });
        return userUpdate;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

async function createNewChatroomNotification(
    user1: string,
    user2: string,
    chatId: string,
) {
    try {
        // user1 interested in your ListingEditModal.

        const interestedUser = await pb.collection("users").getOne(user1);
        const data = {
            text: `${interestedUser.firstName} ${interestedUser.lastName} is interested in one of your items. Click to view their message.`,
            hasViewed: false,
            chat: chatId,
        };
        const notification = await pb.collection("notifications").create(data);
        const user = await pb.collection("users").getOne(user2);
        const userUpdate = await pb.collection("users").update(user2, {
            notifications: [...user.notifications, notification.id],
        });

        return userUpdate;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

async function createNewMessageNotification(
    senderId: string,
    receiverId: string,
    chatId: string,
) {
    try {
        // user1 interested in your ListingEditModal.

        const sender = await pb.collection("users").getOne(senderId);
        const data = {
            text: `${sender.firstName} ${sender.lastName} sent you a message. Click to view`,
            hasViewed: false,
            chat: chatId,
        };
        const notification = await pb.collection("notifications").create(data);
        const user = await pb.collection("users").getOne(receiverId);
        const userUpdate = await pb.collection("users").update(receiverId, {
            notifications: [...user.notifications, notification.id],
        });

        return userUpdate;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function getPBNotifications(userId: string) {
    try {
        // user1 interested in your ListingEditModal.
        const user = await pb.collection("users").getOne(userId, {
            expand: "notifications",
        });

        return user;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function setPBNotificationsHasViewedTrue(userId: string) {
    try {
        const user = await pb.collection("users").getOne(userId, {
            expand: "notifications",
        });
        let notifications = user.notifications;

        for (let i = 0; i < notifications.length; i++) {
            await pb
                .collection("notifications")
                .update(notifications[i], { hasViewed: true });
        }

        return true;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
        return false;
    }
}



export async function getUserInfoPB(id: string) {
    try {
        let res = await pb.collection("users").getOne(id);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function increaseReviewCountPB(id: string, pos: boolean) {
  try {
    const user = await pb.collection("users").getOne(id);
    let newCount;
    if (pos) {
      newCount = user.rating + 1;
    } else {
      newCount = user.rating - 1;
    }
    const data = { rating: newCount };

    const res = await pb.collection("users").update(id, data);
    cookies().set("rating", user.rating);

    return res;
  } catch (error) {
    console.error("Error increasing review count:", error);
    return null;
  }
}
