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
} from "@mantine/core";
import Link from "next/link";
import { Listing } from "@/app/lib/types";
import { getUserInfo, increaseReviewCount } from "@/app/lib/actions"; // Update with the appropriate actions
import "@/app/globals.css";
import "@mantine/core/styles.css";
import { useAmp } from "next/amp";
import { useAuth } from "@/app/lib/contexts";
import { list } from "postcss";
import { RecordModel } from "pocketbase";
import { useRouter } from "next/navigation";
import { Resizable } from "react-resizable";

const NEXT_PUBLIC_POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

/**
 * Display a specific User within a modal.
 */
export default function ProfileViewModal({
  open,
  close,
  listing,
}: {
  open: boolean;
  close: () => void;
  listing: Listing;
}) {
  const [userInfo, setUserInfo] = useState<any>([]);
  const [liked, setLiked] = useState(false); // State to track whether the user has liked the profile
  const [disliked, setDisliked] = useState(false); // State to track whether the user has disliked the profile

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userData = await getUserInfo(listing.user as string);
        setUserInfo(userData);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    if (open) {
      fetchUserInfo();

      const likedStatus = localStorage.getItem(`liked_${listing.user}`);
      const dislikedStatus = localStorage.getItem(`disliked_${listing.user}`);

      // Set liked/disliked state based on local storage
      if (likedStatus === "true") {
        setLiked(true);
      } else {
        setLiked(false);
      }

      if (dislikedStatus === "true") {
        setDisliked(true);
      } else {
        setDisliked(false);
      }
    }
  }, [open, listing]);

  const handleLike = async (like: boolean) => {
    try {
      await increaseReviewCount(listing.user as string, like);

      // Update local storage based on like/dislike
      if (like) {
        localStorage.setItem(`liked_${listing.user}`, "true");
        setLiked(true);
      } else {
        localStorage.setItem(`disliked_${listing.user}`, "true");
        setDisliked(true);
      }

      const userData = await getUserInfo(listing.user as string);
      setUserInfo(userData);
    } catch (error) {
      console.error("Error liking/disliking profile:", error);
    }
  };

  return (
    <Modal opened={open} onClose={close}>
      <div style={{ fontWeight: "bold", fontSize: "25px" }}>User Profile</div>
      <div className="flex flex-col items-center justify-center h-full">
        {userInfo ? (
          <div>
            <div className="rounded-full overflow-hidden w-48 h-48 bg-gray-200 ">
              <Image
                src={`${NEXT_PUBLIC_POCKETBASE_URL}/api/files/users/${userInfo.id}/${userInfo.avatar}`}
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
            </div>
            <p>
              Name: {userInfo.firstName} {userInfo.lastName}
            </p>
            <p>Year: {userInfo.year}</p>
            <p>Likes: {userInfo.rating}</p>
            {/* Thumbs up button */}
            <div className="flex">
              <Button onClick={() => handleLike(true)} disabled={liked}>
                {liked ? "👍 Yay" : "👍 Yay"}
              </Button>
              <div style={{ margin: "4px" }} />
              <Button onClick={() => handleLike(false)} disabled={disliked}>
                {disliked ? "👎 Nay" : "👎 Nay"}
              </Button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </Modal>
  );
}
