import React from 'react';
import { MantineProvider, AppShell, Burger, Group, Button, Title, Skeleton, Image, Stack, Text } from '@mantine/core';
import Link from "next/link";
import ListingsContainer from '@/app/home/(listings)/listingsContainer';
import "@/app/globals.css"
import '@mantine/core/styles.css';

const Page = () => {
    return (
        <ListingsContainer headerTitle="Saved Listings" isAllListings={"saved"} isCategory={""} />
    );
}

export default Page;
