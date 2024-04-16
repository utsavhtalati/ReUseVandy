import React from 'react';
import { render, act } from '@testing-library/react';
import Notifications from '@/app/home/Notifications'; 

jest.mock('@/app/lib/actions', () => ({
  getNotifications: jest.fn().mockResolvedValue({
    expand: {
      notifications: [{ id: '1', hasViewed: false, text: 'Test notification', chat: '1' }],
    },
  }),
  setNotificationsTrue: jest.fn(),
}));

jest.mock('@/app/lib/contexts', () => ({
  useAuth: () => ({ id: '1' }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Notifications Component', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      const { getByText } = render(<Notifications />);
      expect(getByText('Test notification')).toBeInTheDocument();
    });
  });
});