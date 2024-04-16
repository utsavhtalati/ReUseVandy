'use client';
import React, { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, MantineProvider, AppShell, Burger, Group, Button, Title, Skeleton, Image, Stack, Text } from '@mantine/core';
import Link from "next/link";
import ListingViewModal from './listingViewModal';
import ListingEditModal from './listingEditModal';
import { Listing } from '@/app/lib/types';
import { getListings } from '@/app/lib/actions';
import "@/app/globals.css"
import '@mantine/core/styles.css';

const NEXT_PUBLIC_POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL

export default function SingleListingEdit({ listing, refetchListings }: { listing: Listing, refetchListings: () => void }) {
    const [editOpened, editHandlers] = useDisclosure(false);
    const [viewOpened, viewHandlers] = useDisclosure(false);

    function handleViewOpen() {
        viewHandlers.open();
        editHandlers.close();
    }
    function handleEditOpen() {
        viewHandlers.close();
        editHandlers.open();
    }
    return (
        <>
            <ListingViewModal open={viewOpened} close={viewHandlers.close} listing={listing} pagetype={"edit"} />
            <ListingEditModal open={editOpened} close={editHandlers.close} listing={listing} refetchListings={refetchListings} />
            <div style={{ height: "16em", width: "13em" }} className="cursor-pointer center flex-col rounded bg-gray-300 p-3">
                <div style={{
                    width: "9em", height: "9em", overflow: "hidden"
                }}>
                    < Image
                        src={`${NEXT_PUBLIC_POCKETBASE_URL}/api/files/listings/${listing.id}/${listing.image}?thumb=100x300`}
                        alt="Profile Photo"
                        fit='cover'
                        className='!rounded'
                    />
                </div>
                <div className="flex justify-between w-full px-3 my-2">
                    <Text fw={500}>{listing.title}</Text>
                    <Text >${listing.price}</Text>
                </div>
                <Group>
                    <Button variant="light" onClick={handleViewOpen}>Preview</Button>
                    <Button variant="light" onClick={handleEditOpen}>Edit</Button>
                </Group>
            </div >
        </>
    );
}

