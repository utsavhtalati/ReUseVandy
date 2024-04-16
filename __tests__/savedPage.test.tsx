import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '@/app/home/saved-listings/page'; 

jest.mock('@/app/home/(listings)/listingsContainer', () => {
    return ({ headerTitle, isAllListings, isCategory }: { headerTitle: string, isAllListings: boolean, isCategory: boolean }) => {
        return (
            <div>
                {headerTitle}, {isAllListings}, {isCategory}
            </div>
        );
    };
});

describe('Page Component', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByText('Saved Listings, saved, ')).toBeInTheDocument();
  });
});