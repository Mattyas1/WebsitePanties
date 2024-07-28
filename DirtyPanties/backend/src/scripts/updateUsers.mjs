import './config/env.mjs'


import mongoose from 'mongoose';
import User from '../mongoose/schemas/User.mjs'

const MONGO_URI = process.env.MONGO_URI;

const updateProducts = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Update all existing users
        await User.updateMany({}, {
            $set: { role: 'admin' }
        });

        console.log('Users updated successfully.');
    } catch (error) {
        console.error('Error updating users:', error);
    } finally {
        mongoose.connection.close();
    }
};

updateProducts();