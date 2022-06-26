declare type UserPayload = {
    email: string;
    role: string;
    id: string;
}

export declare type exports = {
    getToken(payload: UserPayload): Promise<string>;
    getPayload(token: string): Promise<UserPayload>;
}
