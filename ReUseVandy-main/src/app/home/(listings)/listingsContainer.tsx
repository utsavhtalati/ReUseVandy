"use client";
import React, { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { IconMessageCircle } from "@tabler/icons-react";
import { IconFilter } from "@tabler/icons-react"; // Import the filter icon
import {
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
  Modal,
  MultiSelect,
} from "@mantine/core";
import Link from "next/link";
import { Listing } from "@/app/lib/types";
import { getListings, getMyListings, getSavedListings } from "@/app/lib/actions";
import SingleListing from "./singleListing";
import SingleListingEdit from "./singleListingEdit";
import CreateListing from "./createListingModal";
import { useAuth } from "@/app/lib/contexts";
import "@/app/globals.css";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { Menu } from "@mantine/core";

/**
 * Dynamic container for all listings to the authenticated user.
 */
export default function ListingsContainer({
  headerTitle,
  isAllListings = "all",
}: {
  headerTitle: string;
  isAllListings: "all" | "my" | "saved";
  isCategory: string;
}) {
  const { id } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState("newest"); // 'newest' or 'oldest'
  const [locationFilter, setLocationFilter] = useState("");
  const [sortStatus, setSortStatus] = useState(""); // '' or 'available' or 'sold'

  //  these are your location options for now
  const locationOptions = [
    { value: "Rothschild", label: "Rothschild" },
    { value: "Zeppos", label: "Zeppos" },
    { value: "Kissam", label: "Kissam" },
    { value: "EBI", label: "EBI" },
    { value: "Main Campus", label: "Main Campus" },
    { value: "Commons", label: "Commons" },
  ];



  const toggleSortByStatus = (status: React.SetStateAction<string>) => {
    setSortStatus(status);

    const sortedListings = [...listings].sort((a, b) => {
      return status === "available"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    });

    setListings(sortedListings);
  };

  /**
   * FetchAllListings calls 'getListing' action to retrieve all listings and updates 'listings' state with the response data.
   * FetchMyListings calls 'getMyListings' action with user ID similar to getLisitngs implementation.
   */
  const toggleSortByDate = (direction: React.SetStateAction<string>) => {
    setSortDirection(direction);

    const sortedListings = [...listings].sort((a, b) => {
      const dateA = new Date(a.created).getTime();
      const dateB = new Date(b.created).getTime();

      return direction === "newest" ? dateB - dateA : dateA - dateB;
    });

    setListings(sortedListings);
  };

  /**
   * Asynchronously fetches all listings from the backend and sets the state for listings.
   *
   * @async
   * @function fetchAllListings
   * @returns {Promise<void>} - Returns nothing, but updates the state with the fetched listings.
   */
  async function fetchAllListings() {
    try {
      let res = await getListings();
      if (Array.isArray(res) && res.length > 0) {
        console.log("lksdfn");
        const allListings: Listing[] = res.map((item) => ({
          // Assuming getListings() returns data that needs to be mapped to the Listing interface
          id: item.id,
          image: item.image,
          title: item.title,
          location: item.location,
          status: item.status,
          created: item.created,
          user: item.user,
          description: item.description,
          price: item.price,
          category: item.category,
          times_reported: item.times_reported,
        }));
        setListings(allListings);
        setAllListings(allListings);
        console.log(allListings);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Asynchronously retrieves listings associated with a specific user. This function calls
   * `getMyListings(id)` and expects an array of listings in return. If successful, it maps the response
   * to the `Listing` interface structure, updating the state with the user's listings.
   *
   * @async
   * @function fetchMyListings
   * @param {number} id - The unique identifier of the user whose listings are to be fetched.
   * @returns {Promise<void>} - Does not return a value, but upon resolution, it updates the state with the user's listings.
   */

  async function fetchMyListings() {
    try {
      let res = await getMyListings(id);
      console.log("res", res);
      if (Array.isArray(res) && res.length > 0) {
        console.log("lksdfn");
        const allListings: Listing[] = res.map((item) => ({
          // Assuming getListings() returns data that needs to be mapped to the Listing interface
          id: item.id,
          image: item.image,
          title: item.title,
          location: item.location,
          status: item.status,
          created: item.created,
          user: item.user,
          description: item.description,
          price: item.price,
          category: item.category,
          times_reported: item.times_reported,
        }));
        setListings(allListings);
        console.log("all my listings ", allListings);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function fetchSavedListings() {
    try {
      let res = await getSavedListings(id);
      console.log("res", res);
      if (Array.isArray(res) && res.length > 0) {
        console.log("lksdfn");
        const allListings: Listing[] = res.map((item) => ({
          // Assuming getListings() returns data that needs to be mapped to the Listing interface
          id: item.id,
          image: item.image,
          title: item.title,
          location: item.location,
          status: item.status,
          created: item.created,
          user: item.user,
          description: item.description,
          price: item.price,
          category: item.category,
          times_reported: item.times_reported,
        }));
        setListings(allListings);
        console.log("all my listings ", allListings);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (id) {
      //if is all then looking at main listings page
      if (isAllListings == "all") {
        console.log("all listings");
        fetchAllListings();
      } else if (isAllListings == "saved") {
        console.log("Saved listings ", listings);
        fetchSavedListings();
      } else {
        //if we aren't looking at all listing must be looking at myListings instead
        console.log("My listings ", listings);
        fetchMyListings();
      }
    }
  }, [id]);

  useEffect(() => {
    if (categories.length > 0) {
      const filteredListings = allListings.filter((listing) =>
        categories.includes(listing.category),
      );
      setListings(filteredListings);
    } else {
      setListings(allListings);
    }
  }, [categories]); // Add other categories as needed

  useEffect(() => {
    // This effect triggers when `locationFilter` changes
    const applyFilters = () => {
      let filteredListings = [...allListings]; // Start with all listings

      // Apply location filter
      if (locationFilter) {
        filteredListings = filteredListings.filter(
          (listing) => listing.location === locationFilter,
        );
      }

      // Apply other filters like category if you have any
      // if (categoryFilter) { ... }

      setListings(filteredListings); // Update the listings displayed
    };

    applyFilters();
  }, [allListings, locationFilter]);

  /**
   * Component rendering a UI for creating listings and managing the display of existing listings.
   *
   * @param {boolean} opened - A boolean flag for visibility of the 'CreateListing' modal.
   * @param {function} close - A function to close the 'CreateListing' modal.
   * @param {boolean} isAllListings - A boolean flag  whether all listings or only user's listings should be fetched.
   * @param {function} fetchAllListings - Function to fetch all listings.
   * @param {function} fetchMyListings - Function to fetch only the user's listings.
   * @param {string} headerTitle - Title to be displayed on the header.
   * @param {array} listings - An array of listing objects to be displayed.
   * @param {function} toggleSortByDate - Function to sort listings by date.
   * @param {array} locationOptions - Array of location options for filtering listings.
   * @param {function} setLocationFilter - Function to set the location filter for listings.
   * @param {array} categories - Array of selected category filters.
   * @param {function} setCategories - Function to update the category filters.
   *
   * @returns {JSX.Element} - A React fragment that includes the 'CreateListing' component,
   * header with title, add, chat, filter, and sort options, and a section displaying the listings.
   */

  return (
    <>
      <CreateListing
        open={opened}
        close={close}
        fetchListings={(isAllListings == "all") ? fetchAllListings : (isAllListings == "my" ? fetchMyListings : fetchSavedListings)}
      />
      <div className="h-full flex flex-col w-full">
        <div
          style={{ borderBottom: "2px solid lightgrey" }}
          className="relative h-12 mb-2 w-full flex justify-between items-center px-4"
        >
          {/* <MultiSelect
                placeholder="Categories"
                value={categories}
                onChange={setCategories}
                data={[
                  'Electronics',
                  'Home & Garden',
                  'Fashion & Accessories',
                  'Books & Education',
                  'Sports & Outdoors',
                  'Services',
                ]}
              /> */}
          <Title order={3}>{headerTitle}</Title>
          {isAllListings == "all" &&
            <Group>
              <Button
                component={Link}
                href="/home/chat"
                variant="default"
                size="xs"
              >
                <IconMessageCircle size={16} /> Chats
              </Button>
              <Button onClick={open} variant="default" size="xs">
                <IconPlus size={16} /> Add
              </Button>
              <Menu withinPortal>
                <Menu.Target>
                  <Button variant="default" size="xs">
                    <IconFilter size={16} /> Filter & Sort
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Sort by</Menu.Label>
                  <Menu.Item onClick={() => toggleSortByDate("newest")}>
                    Date (Newest first)
                  </Menu.Item>
                  <Menu.Item onClick={() => toggleSortByDate("oldest")}>
                    Date (Oldest first)
                  </Menu.Item>
                  <Menu.Item onClick={() => toggleSortByStatus("available")}>
                    Available first
                  </Menu.Item>
                  <Menu.Item onClick={() => toggleSortByStatus("sold")}>
                    Sold first
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Filter by Location</Menu.Label>
                  {locationOptions.map((option) => (
                    <Menu.Item
                      key={option.value}
                      onClick={() => setLocationFilter(option.value)}
                    >
                      {option.label}
                    </Menu.Item>
                  ))}
                  <Menu.Divider />
                  <Menu.Label>Filter by Category</Menu.Label>
                  {[
                    "Electronics",
                    "Home & Garden",
                    "Fashion & Accessories",
                    "Books & Education",
                    "Sports & Outdoors",
                    "Services",
                  ].map((category) => (
                    <Menu.Item
                      key={category}
                      onClick={() => {
                        if (!categories.includes(category)) {
                          setCategories([...categories, category]);
                        }
                      }}
                    >
                      {category}
                    </Menu.Item>
                  ))}
                  <Menu.Item onClick={() => setCategories([])}>
                    Clear Categories
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>}
        </div>
        <div className="flex px-5 py-4 flex-wrap content-start gap-3 w-full h-full overflow-y-scroll">
          {listings.length > 0 &&
            listings.map((listing) => (
              <div key={listing.id}>
                {(isAllListings == "all" || isAllListings == "saved") ? (
                  <SingleListing listing={listing} pagetype={isAllListings} />
                ) : (
                  <SingleListingEdit
                    listing={listing}
                    refetchListings={fetchMyListings}
                  />
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="listings-container"></div>
    </>
  );
}
