'use client'
import { Button, Checkbox, createTheme, Text, Divider, MantineProvider, PasswordInput, TextInput, Title, Group } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import '@mantine/core/styles.css';
import { register } from '@/app/lib/actions'
import { useFormState, useFormStatus } from 'react-dom'
import error from 'next/error';

const SignUpForm = ({ setIsLoginState }: { setIsLoginState: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [errorMessage, dispatch] = useFormState(register, undefined);

    return (
        <>
            <Title className="!mb-3">Register</Title>

            <form action={dispatch}>
                <Group grow justify="space-between">
                    <TextInput
                        label="First Name"
                        className="auth-input"
                        name="firstName"
                    />
                    <TextInput
                        label="Last Name"
                        className="auth-input"
                        name="lastName"
                    />
                </Group>

                <TextInput
                    label="Email Address"
                    className="auth-input"
                    name="email"
                />

                <Group grow justify="space-between">
                    <PasswordInput
                        className="auth-input"
                        label="Password"
                        name="password"
                    />
                    <PasswordInput
                        className="auth-input"
                        label="Confirm Password"
                        name="confirmPassword"
                    />
                </Group>

                {errorMessage && <FormError>{errorMessage}</FormError>}

                <Button fullWidth className="mb-4 mt-3" type="submit">
                    Register
                </Button>

            </form>
            <Divider size="xs" className="my-3" />
            <Text size="sm">
                Already have an account? <button onClick={() => setIsLoginState(true)}>Login</button>
            </Text>
        </ >
    );
}

function FormError({ children }: { children: React.ReactNode }) {
    return (
        <Text c="red" className="!mt-2">
            {children}
        </Text>
    )
}

export default SignUpForm;
