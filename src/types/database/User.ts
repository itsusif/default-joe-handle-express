import { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    id: string;
    username: string;
    global_name?: string;
    email: string | null;
    avatar?: string;
    isOwner: boolean;
    balance: number;
    accessToken: string | null;
    refreshToken: string | null;
    toJSON(): IUserPublic;
    toPublic(): IUserPublic;
}

export interface IUserPublic {
    _id: Schema.Types.ObjectId;
    id: string;
    username: string;
    global_name?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    findUser(id: string | Schema.Types.ObjectId): Promise<IUser | null>;
};