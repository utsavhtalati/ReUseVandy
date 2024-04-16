
import ProfilePage from '@/app/home/profile/page'
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

test('simple test', () => {
    render(<ProfilePage />)
    expect(true).toBe(true);
});

jest.mock('@/app/lib/contexts', () => ({
    useAuth: jest.fn(() => ({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        year: '2023',
        dateJoined: '2021-01-01',
        profilePhoto: 'profilePhoto.jpg',
        logout: jest.fn(),
        refetchUser: jest.fn(),
    })),
}));

jest.mock('@/app/lib/actions', () => ({
    editUserInfo: jest.fn(),
}));



describe('ProfilePage Component', () => {
    it('renders user information', () => {
        render(<ProfilePage />);
        expect(screen.getByText('First Name: John')).toBeInTheDocument();
        expect(screen.getByText('Last Name: Doe')).toBeInTheDocument();
        expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
    });

    it('toggles edit mode', () => {
        render(<ProfilePage />);
        fireEvent.click(screen.getByText('Edit Profile'));
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.getByText('Last Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('john.doe@example.com')).toBeInTheDocument();
    });
});
