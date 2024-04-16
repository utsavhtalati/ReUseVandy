"use server";
import {
    signIn,
    createAccount,
    editUser,
    getPBListings,
    getMyPBListings,
    createPBListing,
    deletePBListing,
    editPBListing,
    createPBMessage,
    createPBChat,
    getPBChats,
    getSinglePBChat,
    handlePBReport,
    getPBNotifications,
    setPBNotificationsHasViewedTrue,
    deletePBChat,
    getUserInfoPB,
    getMySavedPBListings,
    addToMySavedPBListings,
    getIfPBListingsSaved,
    removeMySavedPBListings,
    increaseReviewCountPB,
} from "@/auth";
import { cookies } from "next/headers";
import { Listing } from "@/app/lib/types";

export async function authenticate(previousState: any, formData: FormData) {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
        throw error;
    }
}

export async function getUserInfo(id: string) {
    try {
        const user = await getUserInfoPB(id);
        return user;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function editUserInfo(id: string, data: any) {
    try {
        await editUser(id, data);
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function register(previousState: any, formData: FormData) {
    try {
        let newUser = await createAccount(formData);
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function getUserCookies() {
    try {
        if (
            !cookies().has("id") ||
            !cookies().has("firstName") ||
            !cookies().has("lastName") ||
            !cookies().has("email")
        ) {
            return null;
        }
        const singleObject = cookies()
            .getAll()
            .reduce((acc: any, cookie: any) => {
                acc[cookie.name] = cookie.value;
                return acc;
            }, {});

        return singleObject;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function logoutUser() {
    //TODO, safer to get all cookies and loop through, deleting each one
    cookies().delete("id");
    cookies().delete("firstName");
    cookies().delete("lastName");
    cookies().delete("email");
    cookies().delete("year");
    cookies().delete("dateJoined");
    cookies().delete("avatar");
}

export async function getListings() {
    try {
        const listings = await getPBListings();
        return listings;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function getMyListings(id: string) {
    try {
        const listings = await getMyPBListings(id);
        return listings;
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return error.message;
        }
    }
}
export async function getMySavedListings(id: string) {
    try {
        const listings = await getMySavedPBListings(id);
        return listings;
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function createListing(data: any) {
    try {
        const listing = await createPBListing(data);
        return listing;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}
export async function createMessage(
    sender: string,
    reciever: string,
    content: string,
    chatId: string,
) {
    try {
        const message = await createPBMessage(sender, reciever, content, chatId);
        return message;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function getChats(user: string) {
    try {
        const chats = await getPBChats(user);
        return chats;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}
export async function getSingleChat(id: string) {
    try {
        const chat = await getSinglePBChat(id);
        return chat;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function createChat(user1: string, user2: string) {
    try {
        const chat = await createPBChat(user1, user2);
        return chat;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function deleteChat(chatId: any) {
    try {
        let res = await deletePBChat(chatId);
        return res;
    } catch (error) {
        if (error) {
            if (error instanceof Error) {
                return error.message;
            }
        }
    }
}

export async function deleteListing(userId: string, listingId: any) {
    try {
        let res = await deletePBListing(userId, listingId);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function editListing(
    userId: string,
    listingId: string,
    data: any,
) {
    try {
        let res = await editPBListing(userId, listingId, data);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function handleReport(listingId: string, data: any) {
    try {
        let res = await handlePBReport(listingId, data);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function getNotifications(userId: string) {
    try {
        let res = await getPBNotifications(userId);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function setNotificationsTrue(userId: string) {
    try {
        let res = await setPBNotificationsHasViewedTrue(userId);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}


export async function getSavedListings(id: string) {
    try {
        const listings = await getMySavedPBListings(id);
        return listings;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function addSavedListings(userId: string, listingId: string) {
    try {
        const listings = await addToMySavedPBListings(userId, listingId);
        return listings;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}
export async function removeMySavedListings(userId: string, listingId: string) {
    try {
        const listings = await removeMySavedPBListings(userId, listingId);
        return listings;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}



export async function isUserListingSaved(userId: string, listingId: string) {
    try {
        const listings = await getIfPBListingsSaved(userId, listingId);
        return listings;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}

export async function increaseReviewCount(id: string, pos: boolean) {
    try {
        let res = await increaseReviewCountPB(id, pos);
        return res;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}
