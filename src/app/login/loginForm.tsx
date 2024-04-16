'use client'
import { Button, Checkbox, createTheme, Text, Divider, MantineProvider, PasswordInput, TextInput, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import '@mantine/core/styles.css';
import { authenticate, getUserCookies } from '@/app/lib/actions'
import { useFormState, useFormStatus } from 'react-dom'

const LoginForm = ({ setIsLoginState }: { setIsLoginState: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);


    return (
        <>
            <Title className="!mb-3">Login</Title>

            <form action={dispatch} className="flex flex-col gap-y-1">
                <TextInput label="Email Address" type="email" name="email" placeholder="Email" />
                <TextInput label="Password" type="password" name="password" placeholder="Password" />
                <div>{errorMessage && <p>{errorMessage}</p>}</div>
                <LoginButton />

                <Divider size="xs" className="my-3" />
                <Text size="sm">
                    No account yet? <button onClick={() => setIsLoginState(false)}>Sign Up</button>
                </Text>
            </form>

        </ >
    );
}

function LoginButton() {
    const { pending } = useFormStatus()

    return (
        <Button className="w-100 mt-4" type="submit">
            {pending ? <p>Logging in...</p> : <p>Log in</p>}
        </Button>
    )
}

export default LoginForm;
