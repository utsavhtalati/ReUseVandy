import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '@/app/layout'; 

describe('RootLayout Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<RootLayout>Test Child</RootLayout>);
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});