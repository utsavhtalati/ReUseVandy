module.exports = function PocketBase() {
    return {
        // Mock any methods you use from the PocketBase client here
        collection: () => ({
            create: jest.fn().mockResolvedValue({ /* mock response */ }),
            getFullList: jest.fn().mockResolvedValue([/* mock response */]),
            // Add other methods as needed
        }),
        // Continue mocking other parts of the PocketBase API as needed
    };

}
