import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  MantineProvider,
  AppShell,
  Burger,
  Group,
  Button,
  Title,
  Skeleton,
  Image,
  Stack,
  Text,
  Container,
  TextInput,
  Radio,
} from "@mantine/core";
import Link from "next/link";
import { Listing } from "@/app/lib/types";
import { getListings, createChat, getSavedListings, createMessage, addSavedListings, isUserListingSaved, removeMySavedListings } from "@/app/lib/actions";
import { handleReport } from "@/app/lib/actions";
import "@/app/globals.css";
import "@mantine/core/styles.css";
import { useAmp } from "next/amp";
import { useAuth } from "@/app/lib/contexts";
import { list } from "postcss";
import { RecordModel } from "pocketbase";
import { useRouter } from "next/navigation";
import { Resizable } from "react-resizable";
import ProfileViewModal from "../(profile)/profileViewModal";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";

const NEXT_PUBLIC_POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

const categoryColors = {
  Electronics: "blue",
  "Home & Garden": "green",
  "Fashion & Accessories": "pink",
  "Books & Education": "orange",
  "Sports & Outdoors": "red",
  Services: "gray",
  // Add other categories and colors as needed
};

// Function to safely access category colors
function getCategoryColor(category: string): string {
  return categoryColors[category as keyof typeof categoryColors] || "black"; // default color
}

/**
 * Display a specific listingg within a modal.
 */
export default function ListingViewModal({
  open,
  close,
  listing,
  pagetype
}: {
  open: boolean;
  close: () => void;
  listing: Listing;
  pagetype: string;
}) {
  const { id } = useAuth();
  const router = useRouter();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [
    isProfileModalOpened,
    { open: openProfileModal, close: closeProfileModal },
  ] = useDisclosure(false); // State for profile modal

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function checkIfSaved() {
      try {
        const res = await isUserListingSaved(id, listing.id as string);
        setIsSaved(res);
      } catch (error) {
        console.error(error);
      }
    }
    if (id) {
      checkIfSaved();
    }
  }, [id, listing.id]);


  async function addToSavedListings() {
    try {
      await addSavedListings(id, listing.id as string);
    } catch (error) {
      console.error("Error saving listing:", error);
      alert("Error saving listing");
    }
  }



  const handleCreateChat = async () => {
    try {
      if (id === listing.user) {
        alert("You cannot message yourself");
      }

      if (typeof listing.user === "string" && id !== listing.user) {
        const response = await createChat(id, listing.user);
        await createMessage(
          id,
          listing.user,
          message,
          (response as RecordModel).id,
        );
        alert("Message sent successfully");
        router.push(`/home/chat/${(response as RecordModel).id}`);
      }

      setMessage("");
      setShowMessageForm(false);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message");
    }
  };

  async function handleClickReport() {
    setShowConfirmationModal(true);
  }

  async function handleConfirmReport() {
    try {
      let res = await handleReport(listing.id, {
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        status: listing.status,
        category: listing.category,
        times_reported: listing.times_reported + 1,
      });
      console.log();
      if (res) {
        window.location.reload();
        alert(
          "Listing has been reported successfully. If the listing is found to be in violation of our terms of service, it will be removed. Thank you for helping keep our community safe.",
        );
        close();
      }
    } catch (error) {
      console.error(error);
    }
    setShowConfirmationModal(false);
  }
  async function handleRemovefromSavedListings() {
    try {
      await removeMySavedListings(id, listing.id as string);
      setIsSaved(false);
      window.location.reload();
    } catch (error) {
      console.error("Error saving listing:", error);
      alert("Error saving listing");
    }

  }
  async function handleAddToSavedListings() {
    try {
      await addToSavedListings();
      setIsSaved(true);
      window.location.reload();
    } catch (error) {
      console.error("Error saving listing:", error);
      alert("Error saving listing");
    }
  }

  /**
   * Renders a modal containing detailed information about a listing.
   * @returns {JSX.Element} A fragment containing a Modal component with the detailed view of a listing.
   *
   * `listing` should be an object containing the relevant details of a listing.
   * `setWidth` and `setHeight` are functions to update the state with the new dimensions.
   * `setShowMessageForm` toggles the visibility of the message form.
   * `handleCreateChat` is the function to call when the send button is clicked.
   * `getCategoryColor` is a function that returns a color based on the listing's category.
   * The `message` state is bound to the input field to control its value.
   */
  return (
    <>
      {showConfirmationModal && (
        <Modal
          opened={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          withCloseButton={false}
          centered
        >
          <Title order={3}>Report This Item</Title>
          <Text>Please select a reason for reporting this listing:</Text>
          <Radio.Group
            value={selectedReason}
            onChange={setSelectedReason}
            mt={20}
          >
            <Radio
              size="md"
              className="my-2"
              value="inappropriate"
              label="Inappropriate content"
            />
            <Radio
              size="md"
              className="my-2"
              value="scam"
              label="Scam or fraud"
            />
            <Radio
              size="md"
              className="my-2"
              value="spam"
              label="Spam or misleading"
            />
            <Radio size="md" className="my-2" value="other" label="Other" />
          </Radio.Group>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setShowConfirmationModal(false)}
              variant="outline"
              color="gray"
              mr={10}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReport}
              color="red"
              disabled={!selectedReason}
            >
              Confirm
            </Button>
          </div>
        </Modal>
      )}
      <Modal opened={open} onClose={close}>
        <div
          className="flex justify-between items-center"
          style={{ fontWeight: "bold", fontSize: "25px", position: "relative" }}
        >
          {listing.title}
          <div style={{ display: "flex" }}>
            {isSaved ?
              <div onClick={handleRemovefromSavedListings}>
                <IconBookmarkFilled />
              </div>

              :
              <div onClick={handleAddToSavedListings}>
                <IconBookmark />
              </div>
            }
            <Button
              onClick={handleClickReport}
              variant="filled"
              color="red"
              size="xs"
              className="ml-2"
            >
              Report
            </Button>
          </div>
        </div>

        <Resizable
          width={width}
          height={height}
          onResize={(e, { size }) => {
            setWidth(size.width);
            setHeight(size.height);
          }}
        >
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <div style={{ marginBottom: "0.5em" }} className="rounded">
              <Image
                src={`${NEXT_PUBLIC_POCKETBASE_URL}/api/files/listings/${listing.id}/${listing.image}?thumb=100x300`}
                alt="Profile Photo"
                fit="cover"
                className="!rounded"
              />
            </div>
            <div className="relative">
              <Group gap={5}>
                <Title order={5}>Description:</Title>
                {listing.description}
              </Group>
              <Group gap={5}>
                <Title order={5}>Price: </Title>${listing.price}
              </Group>
              <Group gap={5}>
                <Title order={5}>Location: </Title>
                {listing.location}
              </Group>
              <Group gap={5}>
                <Title order={5}>Status: </Title>
                {listing.status}
              </Group>
              <Group gap={5}>
                <Title order={5}>Category: </Title>
                <span style={{ color: getCategoryColor(listing.category) }}>
                  {listing.category}
                </span>
              </Group>
              <Group gap={5}>
                <Title order={5}>Date Posted: </Title>
                {listing.created}
              </Group>
            </div>

            <div className="flex mt-3 w-full justify-center">
              <Button onClick={() => setShowMessageForm(true)}>
                Message Seller
              </Button>
            </div>

            {showMessageForm && (
              <div style={{ marginTop: "20px" }}>
                <Text>Your Message:</Text>
                <TextInput
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here"
                />
                <Button
                  onClick={handleCreateChat}
                  style={{ marginTop: "10px" }}
                >
                  Send
                </Button>
              </div>
            )}
          </div>
        </Resizable>
        {/* Button to open profile modal */}
        <Button onClick={openProfileModal} className="mt-4">
          View Profile
        </Button>
        {/* Profile View Modal */}
        <ProfileViewModal
          open={isProfileModalOpened}
          close={closeProfileModal}
          listing={listing}
        />
      </Modal>
    </>
  );
}
