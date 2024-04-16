export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    year: string;
    dateJoined: string;
    profilePhoto: string;
}

export interface Listing {
    id: string;
    price: number;
    description: string;
    image: string;
    title: string;
    location: string;
    status: string;
    created: string;
    user: User | string;
    category: string;
    times_reported: number;
}
