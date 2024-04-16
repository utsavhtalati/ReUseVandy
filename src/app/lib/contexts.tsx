import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserCookies, logoutUser } from "./actions";
import { useRouter } from "next/navigation";

interface AuthContextData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  year: string;
  yearTest: string;
  dateJoined: string;
  profilePhoto: string;
  refetchUser: () => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [id, setId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [yearTest, setYearTest] = useState("");
  const [dateJoined, setDateJoined] = useState("");

  async function setUserDataFromCookies() {
    try {
      let userInfo = await getUserCookies();
      if (userInfo) {
        setId(userInfo.id);
        setFirstName(userInfo.firstName);
        setLastName(userInfo.lastName);
        setEmail(userInfo.email);
        setYear(userInfo.year);
        setYearTest(userInfo.yearTest);
        setDateJoined(userInfo.dateJoined);
        setProfilePhoto(userInfo.avatar);
      }
    } catch (error) {
      console.error("Error setting user data:", error);
    }
  }

  const refetchUser = () => {
    setUserDataFromCookies();
  };

  useEffect(() => {
    setUserDataFromCookies();
  }, []);

  async function logout(): Promise<void> {
    setId("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setYear("");
    setYearTest("");
    setDateJoined("");
    setProfilePhoto("");
    logoutUser();
    router.push("/login");
  }

  const value = {
    id,
    firstName,
    lastName,
    email,
    year,
    yearTest,
    refetchUser,
    dateJoined,
    profilePhoto,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
