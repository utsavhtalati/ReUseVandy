"use client";
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  createTheme,
  Text,
  Divider,
  MantineProvider,
  PasswordInput,
  TextInput,
  Title,
  Image,
  em,
} from "@mantine/core";
import { useAuth } from "@/app/lib/contexts";
import Link from "next/link";
import { editUserInfo } from "@/app/lib/actions";
import "@mantine/core/styles.css";

const NEXT_PUBLIC_POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

const yearOptions = ["freshmen", "sophomore", "junior", "senior"];

const ProfilePage = () => {
  const {
    id,
    firstName,
    lastName,
    email,
    year,
    dateJoined,
    profilePhoto,
    logout,
    refetchUser,
  } = useAuth();

  const [editFirstName, setEditFirstName] = useState(firstName);
  const [editLastName, setEditLastName] = useState(lastName);
  const [editYear, setEditYear] = useState(year);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [inEditMode, setInEditMode] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl("");
    }
  };

  async function handleEditSubmit() {
    const formData = new FormData();
    formData.append("firstName", editFirstName);
    formData.append("lastName", editLastName);
    formData.append("year", editYear);
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    await editUserInfo(id, formData); // Make sure this function or the API it calls supports FormData
    refetchUser();
    setInEditMode(false);
  }

  function handleEnterEditMode() {
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setEditYear(year);
    setSelectedFile(null);
    setPreviewUrl("");
    setInEditMode(true);
  }

  return (
    <MantineProvider>
      <div className="flex flex-col items-center justify-center h-full">
        {inEditMode ? (
          <>
            {previewUrl && (
              <div className="rounded-full overflow-hidden w-32 h-32 bg-gray-200">
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col items-center mt-4">
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer rounded-md text-sm bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Upload Profile Picture
              </label>
              <div className="flex mt-4">
                <Title order={5}>First Name:</Title>
                <div className="ml-2">{editFirstName}</div>
              </div>
              <div className="flex mt-2">
                <Title order={5}>Last Name:</Title>
                <div className="ml-2">{editLastName}</div>
              </div>
              <div className="flex mt-2">
                <Title order={5}>Email:</Title>
                <div className="ml-2">{email}</div>
              </div>
              <div className="flex mt-2">
                <Title order={5}>Year:</Title>
                <select
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  className="ml-2"
                >
                  {yearOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleEditSubmit} className="mt-4">
                Done
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-full overflow-hidden w-48 h-48 bg-gray-200">
              <Image
                src={`${NEXT_PUBLIC_POCKETBASE_URL}/api/files/users/${id}/${profilePhoto}`}
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <Title order={5} className="mr-2">
                    First Name:
                  </Title>
                  <div>{firstName}</div>
                </div>
                <div className="flex items-center mt-2">
                  <Title order={5} className="mr-2">
                    Last Name:
                  </Title>
                  <div>{lastName}</div>
                </div>
                <div className="flex items-center mt-2">
                  <Title order={5} className="mr-2">
                    Email:
                  </Title>
                  <div>{email}</div>
                </div>
                <div className="flex items-center mt-2">
                  <Title order={5} className="mr-2">
                    Year:
                  </Title>
                  <div>{year}</div>
                </div>
                <div className="flex items-center mt-2">
                  <Title order={5} className="mr-2">
                    Date Joined:
                  </Title>
                  <div>{dateJoined}</div>
                </div>
              </div>
              <Button onClick={handleEnterEditMode} className="mt-4">
                Edit Profile
              </Button>
            </div>
          </>
        )}
      </div>
    </MantineProvider>
  );
};

export default ProfilePage;
