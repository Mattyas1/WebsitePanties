import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    
    birthDate: {
        type: Date,
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    refreshToken : {
        type: mongoose.Schema.Types.String,
    },
    coins: {
        type: mongoose.Schema.Types.Number,
    }
    
});

const User = mongoose.model('User', UserSchema);

export default User;