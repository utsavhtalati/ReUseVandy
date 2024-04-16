import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SignUpForm from '@/app/login/signupForm'; 

jest.mock('@/app/lib/actions', () => ({
  register: jest.fn(),
}));

jest.mock('react-dom', () => ({
  useFormState: jest.fn().mockReturnValue([null, jest.fn()]),
  useFormStatus: jest.fn(),
}));

describe('SignUpForm Component', () => {
  it('renders without crashing', () => {
    const setIsLoginState = jest.fn();
    const { getByText } = render(<SignUpForm setIsLoginState={setIsLoginState} />);
    expect(getByText('Register')).toBeInTheDocument();
  });

  it('switches to login state when Login button is clicked', () => {
    const setIsLoginState = jest.fn();
    const { getByText } = render(<SignUpForm setIsLoginState={setIsLoginState} />);
    fireEvent.click(getByText('Login'));
    expect(setIsLoginState).toHaveBeenCalledWith(true);
  });
});