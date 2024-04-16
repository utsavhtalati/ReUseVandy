import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/contexts";
import { getNotifications, setNotificationsTrue } from "@/app/lib/actions";
import { IconBell } from '@tabler/icons-react';
import { Popover, Text, Button, Divider, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';





export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [numUnseen, setNumUnseen] = useState(0);
    const router = useRouter();
    const { id } = useAuth();

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const res = await getNotifications(id);
                const resNotifications = typeof res === 'object' ? res?.expand?.notifications : null;
                console.log("NOTIFICATIONS", res)

                if (resNotifications) {
                    setNotifications(resNotifications);
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (id) {
            fetchNotifications()
        }
    }, [id])


    useEffect(() => {
        let calcUnseen = notifications?.filter((notification: any) => !notification?.hasViewed).length;
        setNumUnseen(calcUnseen);
    }, [notifications])


    function handleViewNotifications(e: any) {
        console.log(e)
        if (e === false) {
            setNumUnseen(0);
        }
        setNotificationsTrue(id);
    }



    function handleRouteToChat(chat: any) {
        if (!chat) return;
        console.log("lKNJSdklfn")
        router.push(`/home/chat/${chat}`)
    }


    return (
        <>
            <Popover onChange={(e) => handleViewNotifications(e)} width={300} position="bottom" withArrow shadow="md" >
                <Popover.Target>
                    <div className="flex relative h-8 w-8">
                        <IconBell />
                        {numUnseen > 0 && <div style={{
                            position: "absolute",
                            right: "0",
                            top: "0",
                            marginRight: "0.4em",
                            width: "1em",
                            height: "1em",
                            backgroundColor: "blue",
                            borderRadius: "50%",
                            padding: "0.7em",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            fontSize: "0.65em"
                        }}>{numUnseen}</div>}
                    </div>
                </Popover.Target>
                <Popover.Dropdown style={{ paddingBottom: "0" }}>
                    {notifications?.filter((notification: any) => !notification?.hasViewed).length > 0 ?
                        notifications
                            ?.filter((notification: any) => !notification?.hasViewed)
                            .map((notification: any) => (
                                <div onClick={() => handleRouteToChat(notification.chat)} key={notification?.id} className={notification?.chat && 'cursor-pointer'}>
                                    <Text size="xs">{notification?.text}</Text>
                                    <Divider className="my-2" />
                                </div>

                            )) :
                        <div className="w-full text-center p-2 pb-3">
                            <Text size="xs">No new notifications</Text>
                        </div>
                    }
                </Popover.Dropdown>
            </Popover>

        </>
    )
}
