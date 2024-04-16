'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, NumberInput, FileInput, MantineProvider, AppShell, Burger, Group, Button, Title, Skeleton, Image, Stack, Text, TextInput, Select } from '@mantine/core';
import Link from "next/link";
import { useAuth } from '@/app/lib/contexts';
import { Listing } from '@/app/lib/types';
import { createListing } from '@/app/lib/actions';
import "@/app/globals.css"
import '@mantine/core/styles.css';


/**
 * Designed to allow users to create new listings on the platform
 * Props: Accepts 'open' 'close' and 'fetchListings' to control visibility. 
 * useAuth Hook: retrieves the current 'id' 
 * useState Hook: manage the state of the form inputs 'title' 'description' 'price' and 'location'
 */
export default function CreateListing({ open, close, fetchListings }: { open: boolean, close: () => void, fetchListings: () => void }) {
    const { id } = useAuth();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<string | number>(0);
    const [location, setLocation] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [category, setCategory] = useState('');


    const categoryOptions = [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Home & Garden', label: 'Home & Garden' },
        { value: 'Fashion & Accessories', label: 'Fashion & Accessories' },
        { value: 'Books & Education', label: 'Books & Education' },
        { value: 'Sports & Outdoors', label: 'Sports & Outdoors' },
        { value: 'Services', label: 'Services' }

        // Add other categories as needed
    
    ];

    const locationOptions = [
        { value: 'Rothschild', label: 'Rothschild' },
        { value: 'Zeppos', label: 'Zeppos' },
        { value: 'Kissam', label: 'Kissam' },
        { value: 'EBI', label: 'EBI' },
        { value: 'Main Campus', label: 'Main Campus' },
        { value: 'Commons', label: 'Commons' }
    ];

    /**
     * Create a FormData object for the file to be uploaded correctly. 
     */
    async function handleSubmit() {

        try {
            /* 
            * Construct 'formData' object and append selected file. 
            */
            const formData = new FormData();
            if (fileInputRef.current && fileInputRef.current.files)
                formData.append('image', fileInputRef.current.files[0]);
            const data = {
                title,
                description,
                price,
                location,
                user: id,
                status: "available",
                image: formData,
                category: category
            }
            /**
             * Create listing with 'data' object. 
             */
            let res = await createListing(data);
            console.log("res", res)
            if (res) {
                fetchListings();
                close();
            }
        } catch (e) {
            console.error(e);
        }
    }


    /**
     * Modal: controlled by 'open' prop for displaying form for creating listing. 
     */
    return (
        <>
            <Modal opened={open} onClose={close} title="Create Listing" >
                <input type="file" id="fileInput" ref={fileInputRef} className="mb-1" />
                <TextInput value={title} onChange={(e) => setTitle(e.currentTarget.value)} label="Title" placeholder="Mini Fridge,  Math 1501 Textbook,  etc." />
                <TextInput value={description} onChange={(e) => setDescription(e.currentTarget.value)} label="Description" placeholder="Color, Quality, Functionality etc." />
                <NumberInput value={price} onChange={setPrice} label="Price" />
                {/* <TextInput value={location} onChange={(e) => setLocation(e.currentTarget.value)} label="Location" placeholder="Highland, Roth, etc." /> */}
                <Select
                    label="Location"
                    placeholder="Select a location"
                    value={location}
                    onChange={(value) => setLocation(value ?? '')}
                    data={locationOptions}
                />
                <Select
                    label="Category"
                    placeholder="Select a category"
                    value={category}
                    onChange={(value) => setCategory(value ?? '')}
                    data={categoryOptions}
                />

                <div className="w-full flex justify-end mt-3">
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </Modal>
        </>
    );
}

