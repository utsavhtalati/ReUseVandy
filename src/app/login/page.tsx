'use client'
import { Button, Checkbox, createTheme, Text, Divider, MantineProvider, PasswordInput, TextInput, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { getUserCookies } from '../lib/actions';
import { AuthProvider } from '../lib/contexts';
import LoginForm from './loginForm';
import SignUpForm from './signupForm';
import '@mantine/core/styles.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
    const router = useRouter();
    const [isLoginState, setIsLoginState] = useState(true);

    async function handleSignIn() {
        let userInfo = await getUserCookies()
        if (userInfo) {
            router.push('/home')
        }
    }

    handleSignIn();

    return (
        // <MantineProvider >
        <AuthProvider>
            <div className="h-screen w-screen center">
                <div className="flex flex-col w-1/3 min-w-80">
                    {isLoginState ? <LoginForm setIsLoginState={setIsLoginState} /> : <SignUpForm setIsLoginState={setIsLoginState} />}
                </div>
            </div>
        </AuthProvider>
        // </MantineProvider>
    );
}
export default LoginPage;
