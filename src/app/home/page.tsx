import React from 'react';
import { MantineProvider, Group, Button, Title } from '@mantine/core';
import Link from "next/link";
import ListingsContainer from '@/app/home/(listings)/listingsContainer';
import "@/app/globals.css"
import '@mantine/core/styles.css';

const Page = () => {
    return (
        <MantineProvider>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <ListingsContainer headerTitle='Listings' isAllListings={"all"} isCategory={""} />
                </div>

            </div>

        </MantineProvider>
    );
}



export default Page;
