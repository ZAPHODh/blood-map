export type Session = {
    email: string;
    user: {
        id: string,
        name: string,
        image: string | undefined | null
    },
    accessToken: string;
};