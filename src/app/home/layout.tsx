"use client";
import { usePathname, useRouter } from "next/navigation";
import { MantineProvider, AppShell, Burger, Group, Button, Title, Skeleton, Image, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "@/app/lib/contexts";
import Notifications from "@/app/home/Notifications";
import { IconBell } from '@tabler/icons-react';
import Link from "next/link";
import "./DashboardLayout.css"
import '@mantine/core/styles.css';
import { getSavedListings, saveTHISListings } from '@/app/lib/actions';

export default function HomeLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const { logout } = useAuth();
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const handleLogout = async () => {
        logout();
        // router.push('/login');
    }

    async function displaySavedListings() {
        const result = await getSavedListings();

        if (Array.isArray(result)) {
            // Success, handle the array of listings
            console.log("Saved Listings:");
            result.forEach(record => {
                console.log(record.listingDetails); // Logs the expanded listing details
                // Additional code to render the listing details in the UI
            });
        } else {
            // An error occurred, handle the error message
            console.error("Error:", result);
        }
    }
    return (
        <AuthProvider >
            <MantineProvider >
                <AppShell
                    style={{ height: "100%", display: "flex", flexDirection: "column" }}
                    header={{ height: 60 }}
                    navbar={{
                        width: 200,
                        breakpoint: 'sm',
                        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
                    }}
                    padding="md"
                >
                    <AppShell.Header style={{ backgroundColor: "#F8F7F4" }}>
                        <Group h="100%" px="md" justify='right'>
                            <Group h="100%" className="!absolute !left-4">
                                <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                                <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                            </Group>
                            <Notifications />
                            <Title order={3} className="font-bold text-emerald-800">Re-Use Vandy 2.0</Title>
                        </Group>
                    </AppShell.Header>
                    <AppShell.Navbar p="md" style={{ backgroundColor: "#F8F7F4" }}>
                        <div className="h-full flex flex-col justify-between">
                            <Stack gap={10} align="stretch">
                                <Link href="/home/profile"><Button size="md" variant="default" fullWidth>Account</Button></Link>
                                <Link href="/home"><Button size="md" variant="default" fullWidth>View Listings</Button></Link>
                                <Link href="/home/my-listings"><Button size="md" variant="default" fullWidth>My Listings</Button></Link>
                                <Link href="/home/chat"><Button size="md" variant="default" fullWidth>Chats</Button></Link>

                                <button onClick={() => displaySavedListings()} className="save-listing-button">
                                    SHOW SAVED
                                </button>
                            </Stack>
                            <Button variant="outline" color="red" onClick={handleLogout}>Logout</Button>
                        </div>
                    </AppShell.Navbar>
                    <AppShell.Main style={{ backgroundColor: "#ebebe6", flex: "1" }}>
                        {children}
                    </AppShell.Main>
                </AppShell>
            </MantineProvider >
        </AuthProvider >
    );
}
