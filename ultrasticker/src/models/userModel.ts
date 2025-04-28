import type { RowDataPacket } from 'mysql2/promise';

export interface IUserModel extends RowDataPacket {
    id: number;
    username: string;
    email: string;
    password: string;
    nickname: string;
    profilePicture: string;
    role: number;            // 1: user, 2: admin
    authProvider: number;    // 1: local, 2: google, 3: apple
    lastLoginAt: string; // or Date
    isActive: boolean;
    createdAt: string;       // or Date
    updatedAt: string;       // or Date
    favclub: number;
}