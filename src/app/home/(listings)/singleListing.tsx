"use client";
import React, { useEffect, useState, useRef } from "react";
import { useDisclosure } from "@mantine/hooks";
import ListingViewModal from "./listingViewModal";
import { Listing } from "@/app/lib/types";
import { IconX } from "@tabler/icons-react";
import { IconCircleCheck } from "@tabler/icons-react";
import { addSavedListings } from "@/app/lib/actions";
import {
  Modal,
  NumberInput,
  FileInput,
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
  TextInput,
  Select,
} from "@mantine/core";
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

/**
 * `SingleListing` is a component that displays an individual listing.
 * It includes an image of the listing, its category with a color coding, title, and price.
 * Clicking on the component opens a modal with more detailed information about the listing.
 *
 * @param {Listing} listing - The listing object to display.
 * @returns {JSX.Element} A React fragment that contains both the clickable listing card and the `ListingViewModal`.
 */
export default function SingleListing({ listing, pagetype }: { listing: Listing, pagetype: string }) {
  const [isOpened, { open, close }] = useDisclosure(false);


  /**
   * Gets the color associated with the listing's category for display.
   * If the category is not found in the `categoryColors` mapping, it defaults to 'black'.
   *
   * @param {string} category - The category of the listing to retrieve the color for.
   * @returns {string} The color string for the given category.
   */
  function getCategoryColor(category: string): string {
    return categoryColors[category as keyof typeof categoryColors] || "black"; // default color
  }

  // The JSX structure for the SingleListing component.
  return (
    <>
      <ListingViewModal open={isOpened} close={close} listing={listing} pagetype={pagetype} />
      <div
        onClick={open}
        className="p-4 cursor-pointer flex flex-col justify-between rounded-lg bg-gray-100 hover:bg-gray-200 h-[280px]"
      >
        <div className="border border-gray-300 rounded-lg overflow-hidden flex-grow h-36 w-36 ml-[20px] mr-[20px]">
          <Image
            src={`${NEXT_PUBLIC_POCKETBASE_URL}/api/files/listings/${listing.id}/${listing.image}?thumb=100x300`}
            alt="Listing Photo"
            fit="cover"
            className="h-full w-full object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col flex-grow p-2">
          <Text
            size="sm"
            style={{ color: getCategoryColor(listing.category) }}
            className="mb-1"
          >
            {listing.category}
          </Text>
          <Text size="lg" className="font-semibold text-gray-800 mb-1">
            {listing.title}
          </Text>
          <Text size="lg" className="text-blue-600 font-semibold">
            ${listing.price}
          </Text>
          {listing.status === "sold" && <IconX size={24} color="red" />}
          {listing.status === "available" && (
            <IconCircleCheck size={24} color="green" />
          )}
        </div>
      </div>
    </>
  );
}
