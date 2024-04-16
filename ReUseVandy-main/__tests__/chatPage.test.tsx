import React from 'react';
import { render, act } from '@testing-library/react';
import SingleChatPage from '@/app/home/chat/[chatId]/page'; 

jest.mock('@/app/lib/actions', () => ({
  getSingleChat: jest.fn().mockResolvedValue({
    expand: {
      users: [{ id: '1' }, { id: '2' }],
      messages: [{ id: '1', sender: '1', content: 'Hello', date: new Date() }],
    },
  }),
  createMessage: jest.fn(),
}));

jest.mock('@/app/lib/contexts', () => ({
  useAuth: () => ({ id: '1' }),
}));

describe('SingleChatPage Component', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      const { getByText } = render(<SingleChatPage params={{ chatId: '1' }} />);
      expect(getByText('Hello')).toBeInTheDocument();
    });
  });
});