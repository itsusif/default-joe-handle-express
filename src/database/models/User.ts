import { IUser, IUserModel } from '@type/database/User';
import { Model, Schema, isValidObjectId, model } from 'mongoose';
import config from '@config';

export const userSchema = new Schema<IUser>({
    id: {
        type: Schema.Types.String,
        required: [true, 'ID is required'],
        unique: true
    },
    username: {
        type: Schema.Types.String,
        required: [true, 'Username is required']
    },
    global_name: {
        type: Schema.Types.String,
        required: false
    },
    email: {
        type: Schema.Types.String,
        required: false,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    avatar: {
        type: Schema.Types.String,
        required: false,
        default: 'https://cdn.discordapp.com/embed/avatars/0.png'
    },
    balance: {
        type: Schema.Types.Number,
        required: false,
        default: 0
    },
    accessToken: {
        type: Schema.Types.String,
        required: false
    },
    refreshToken: {
        type: Schema.Types.String,
        required: false
    }
}, {
    timestamps: true
});

userSchema.index({ id: 1, email: 1 });

userSchema.virtual('isOwner').get(function () {
    return !!config.owners.includes(this.id);
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.__v;
    delete user.guilds;
    return user;
};

userSchema.methods.toPublic = function () {
    const user = this.toJSON();
    delete user.email;
    delete user.guilds;
    return user;
};

userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email });
};

userSchema.statics.findUser = function (id: string) {
    if (!id) return null;

    if (RegExp(/^\d+$/).exec(id)) {
        return this.findOne({ id });
    } else if (isValidObjectId(id)) {
        return this.findOne({
            _id: id
        });
    } else {
        return null;
    }
};

export const userModel = model<IUser, IUserModel>('User', userSchema);