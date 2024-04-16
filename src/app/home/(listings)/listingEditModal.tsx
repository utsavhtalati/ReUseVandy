'use client';
import React, { use, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, MantineProvider, AppShell, Burger, Group, Button, Title, Skeleton, Image, Stack, Text, TextInput, NumberInput } from '@mantine/core';
import Link from "next/link";
import { Listing } from '@/app/lib/types';
import { useAuth } from '@/app/lib/contexts';
import { deleteListing, editListing } from '@/app/lib/actions';
import "@/app/globals.css"
import '@mantine/core/styles.css';
import { Select } from '@mantine/core';


const NEXT_PUBLIC_POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL

/**
 * ListingEditModal: editing and deleting a specific listing. 
 */
export default function ListingEditModal({ open, close, listing, refetchListings }: { open: boolean, close: () => void, listing: Listing, refetchListings: () => void }) {
    const { id } = useAuth();

    const [title, setTitle] = useState<string>(listing.title);
    const [description, setDescription] = useState<string>(listing.description);
    const [price, setPrice] = useState<number | string>(listing.price);
    const [location, setLocation] = useState<string>(listing.location);
    const [status, setStatus] = useState<string>(listing.status);
    const [category, setCategory] = useState(listing.category || '');

    const categoryOptions = [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Home & Garden', label: 'Home & Garden' },
        { value: 'Fashion & Accessories', label: 'Fashion & Accessories' },
        { value: 'Books & Education', label: 'Books & Education' },
        { value: 'Sports & Outdoors', label: 'Sports & Outdoors' },
        { value: 'Services', label: 'Services' }

        // Add other categories as needed
    ];

    useEffect(() => {
        setTitle(listing.title);
        setDescription(listing.description);
        setPrice(listing.price);
        setLocation(listing.location);
        setStatus(listing.status);
        setCategory(listing.category || ''); // Update category state
    }, [open, listing]);

    /**
     * calls 'deleteListing' to delete the user's listing. 
     * calls 'refetchListing' to update the display. 
     * calls 'close' to dismiss the modal. 
     */
    async function handleDeleteListing() {
        try {
            let res = await deleteListing(id, listing.id);
        } catch (error) {
            console.error(error);
        }
        refetchListings();
        close();
    }

    /**
     * calls 'editListing' to submit the edited listing details
     * calls 'refetchListing' to update display
     * calls 'close' to dismass the modal
     */
    async function handleSubmit() {
        console.log(title, description, price, location, status, category); // Include category in log
        try {
            let res = await editListing(id, listing.id, { title, description, price, location, status, category }); // Include category in the edit payload
            if (res) {
                refetchListings();
                close();
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Buttons: 'cancel' and 'submit' 
     * Modal for displaying the listing with Mantine components. 
     */
    return (
        <>
            <Modal opened={open} onClose={close} withCloseButton={false}>
                <div style={{
                    width: "9em", overflow: "hidden", marginBottom: "0.5em"
                }} className="rounded">
                    < Image
                        src={`${NEXT_PUBLIC_POCKETBASE_URL}/api/files/listings/${listing.id}/${listing.image}?thumb=100x300`}
                        alt="Profile Photo"
                        fit='cover'
                        className='!rounded'
                    />
                </div>


                <TextInput value={title} onChange={(e) => setTitle(e.currentTarget.value)} label="Title" placeholder="Mini Fridge,  Math 1501 Textbook,  etc." />
                <TextInput value={description} onChange={(e) => setDescription(e.currentTarget.value)} label="Description" />
                <NumberInput value={price} onChange={setPrice} label="Price" />
                <TextInput value={location} onChange={(e) => setLocation(e.currentTarget.value)} label="Location" />

                <Select value={status} onChange={(e) => setStatus(e ?? "available")} label="Status" data={['available', 'sold']} />

                <Select
                    label="Category"
                    placeholder="Select a category"
                    value={category}
                    onChange={(value) => setCategory(value ?? '')}
                    data={categoryOptions}
                />
                <div className="flex w-full gap-x-3 justify-between mt-3">
                    <Button variant="filled" color="red" onClick={handleDeleteListing}>Delete</Button>
                    <Group gap={8}>
                        <Button onClick={close}>Cancel</Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Group>
                </div>
            </Modal>
        </>
    );
}

