"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import "@mantine/core/styles.css";
import { deleteChat, getChats } from "@/app/lib/actions";
import { useAuth } from "@/app/lib/contexts";
import {
  Paper,
  Avatar,
  Text,
  Group,
  Stack,
  ScrollArea,
  Button,
} from "@mantine/core";
import { useRouter } from "next/navigation";
const NEXT_PUBLIC_POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

const ChatPage = () => {
  const { id } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<any>([]);

  useEffect(() => {
    async function fetchChats() {
      const fetchedChats = await getChats(id); // Fetch the chats
      if (fetchedChats) setChats(fetchedChats);
    }
    if (id) {
      fetchChats();
    }
  }, [id]);

  useEffect(() => {
    console.log("FETCHED CHATS ", chats);
  }, [chats]);

  const handleShowChat = (chat: any) => {
    console.log(chat.id);
    router.push(`/home/chat/${chat.id}`);
  };

  const handleDeleteChat = async (chatId: string) => {
    const res = await deleteChat(chatId);
    if (res) {
      const fetchedChats = await getChats(id);
      if (fetchedChats) setChats(fetchedChats);
    }
  };

  return (
    <div className="center flex-col w-full h-full p-4">
      <ScrollArea style={{ height: "90vh", width: "100%" }} offsetScrollbars>
        <Stack gap="xs" className="w-full">
          {chats?.map((chat: any) => (
            <Paper
              onClick={() => handleShowChat(chat)}
              className="!w-full relative" // Added relative positioning for correct button placement
              shadow="xs"
              p="md"
              key={chat.id}
              radius="md"
              withBorder
            >
              <Group align="center">
                <Avatar
                  src={`${NEXT_PUBLIC_POCKETBASE_URL}/api/files/users/${chat.expand.users[0].id == id ? chat.expand.users[1].id : chat.expand.users[0].id}/${chat.expand.users[0].id == id ? chat.expand.users[1].avatar : chat.expand.users[0].avatar}`}
                  alt="Chat Avatar"
                  radius="xl"
                />
                <div style={{ flex: 1 }}>
                  <Text fw={500}>
                    {chat.expand.users[0].id == id
                      ? chat.expand.users[1].firstName +
                        " " +
                        chat.expand.users[1].lastName
                      : chat.expand.users[0].firstName +
                        " " +
                        chat.expand.users[0].lastName}
                  </Text>
                  <Text size="sm">Click To View Chats</Text>
                </div>
                <Text size="sm" color="dimmed">
                  {new Date(chat.created).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the Paper onClick handler from being triggered
                    handleDeleteChat(chat.id);
                  }}
                >
                  Delete
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      </ScrollArea>
    </div>
  );
};

export default ChatPage;
