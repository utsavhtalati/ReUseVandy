import { jest } from '@jest/globals';

const useRouter = jest.fn(() => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
    query: {}, // Mock query parameters as needed
    asPath: '', // Mock the current path
    route: '/', // Mock the current route
    basePath: '',
    pathname: '',
    events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    },
    beforePopState: jest.fn(),
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
}));

module.exports = {
    useRouter,
};
