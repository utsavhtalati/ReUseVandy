import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ProfileViewModal from '@/app/home/(profile)/profileViewModal'; 
import { Listing } from '@/app/lib/types';

jest.mock("@/app/lib/actions", () => ({
  getUserInfo: jest.fn().mockResolvedValue({
    id: "1",
    firstName: "Test",
    lastName: "User",
    year: "2022",
    rating: "5",
    avatar: "avatar.jpg"
  }),
  increaseReviewCount: jest.fn().mockResolvedValue(true)
}));

describe('ProfileViewModal Component', () => {
  const mockClose = jest.fn();
  const listing: Listing = {
      user: "1",
      id: '',
      price: 0,
      description: '',
      image: '',
      title: '',
      location: '',
      status: '',
      created: '',
      category: '',
      times_reported: 0
  };

  it('renders without crashing', () => {
    render(<ProfileViewModal open={true} close={mockClose} listing={listing} />);
  });

  it('handles like button click', async () => {
    const { getByText } = render(<ProfileViewModal open={true} close={mockClose} listing={listing} />);
    const likeButton = getByText("👍 Yay");
    fireEvent.click(likeButton);
    await waitFor(() => expect(getByText("👍 Yay")).toBeDisabled());
  });

  it('handles dislike button click', async () => {
    const { getByText } = render(<ProfileViewModal open={true} close={mockClose} listing={listing} />);
    const dislikeButton = getByText("👎 Nay");
    fireEvent.click(dislikeButton);
    await waitFor(() => expect(getByText("👎 Nay")).toBeDisabled());
  });
});