import React from 'react';
import { render, act } from '@testing-library/react';
import LoginPage from '@/app/login/page'; 

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../lib/actions', () => ({
  getUserCookies: jest.fn().mockResolvedValue(null),
}));

jest.mock('./LoginForm', () => () => <div>LoginForm</div>);
jest.mock('./SignUpForm', () => () => <div>SignUpForm</div>);

describe('LoginPage Component', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      const { getByText } = render(<LoginPage />);
      expect(getByText('LoginForm')).toBeInTheDocument();
    });
  });
});