import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '@/app/lib/contexts'; 

jest.mock('./actions', () => ({
  getUserCookies: jest.fn().mockResolvedValue({
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com',
    year: '2022',
    yearTest: '2022',
    dateJoined: '2022-01-01',
    avatar: 'avatar.png',
  }),
  logoutUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('AuthProvider Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});