'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import Link from "next/link";
import '@mantine/core/styles.css';
import { getSingleChat, createMessage } from '@/app/lib/actions';
import { useAuth } from '@/app/lib/contexts';
import { Paper, TextInput, Button, Text, Group, Stack, ScrollArea, Title } from '@mantine/core';
import { RecordModel } from 'pocketbase';


const SingleChatPage = ({ params }: { params: { chatId: string } }) => {
    const { id } = useAuth();
    const [newMessage, setNewMessage] = useState<string>("");

    const [messages, setMessages] = useState<any>([]);
    const [otherUser, setOtherUser] = useState<any>([]);

    useEffect(() => {
        async function fetchChat() {
            const fetchedChat = await getSingleChat(params.chatId);
            const users = (fetchedChat as RecordModel)?.expand?.users

            const messages = (fetchedChat as RecordModel)?.expand?.messages?.sort((a: any, b: any) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            })

            if (messages && messages.length > 0) {
                const filteredMessages = messages.map((msg: any) => ({
                    ...msg,
                    isSender: msg.sender == id ? true : false
                }));

                if (filteredMessages) setMessages(filteredMessages);
                if (users && users[0]?.id == id) {
                    setOtherUser(users[1]);
                } else if (users) {
                    setOtherUser(users[0]);
                }
            }
        }
        if (id) {
            console.log(id)
            fetchChat();
        }

    }, [id])

    useEffect(() => {
        console.log("tmp", otherUser)
    }, [otherUser])


    const sendMessage = (values: { message: string }) => {
        // Here you would handle sending the message
        console.log(values.message);
        // form.reset();
    };

    function handleNewMessage() {
        createMessage(id, otherUser.id, newMessage, params.chatId);
        setNewMessage("");
    }

    return (
        <div className="flex flex-col" style ={{height: "90vh"}}>
            <Title order={2} style={{ marginBottom: '10px', margin: "auto" }}>{otherUser.firstName + " " + otherUser.lastName} </Title>
            <ScrollArea className="flex-grow" style={{ height: 'calc(100% - 100px)' }}>
                <Stack gap="xs" className="p-4">
                    {messages?.map((msg: any) => (
                        <Group key={msg.id} justify={msg.isSender ? 'end' : 'start'} className='w-full'>
                            <Paper p="md" shadow="sm" className="bg-gray-100 max-w-xs">
                                <Text>{msg.content}</Text>
                            </Paper>
                            <div></div>
                        </Group>
                    ))}
                </Stack>
            </ScrollArea>
            <form className="p-4">
                <Group justify="center">
                    <TextInput
                        className="flex-grow"
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.currentTarget.value)}
                    />
                    <Button onClick={handleNewMessage} type="submit">Send</Button>
                </Group>
            </form>
        </div>
    );

}

export default SingleChatPage;
