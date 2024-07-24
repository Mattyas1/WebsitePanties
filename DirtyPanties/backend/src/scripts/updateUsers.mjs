import mongoose from 'mongoose';
import User from '../mongoose/schemas/User.mjs'
import { MONGO_URI } from '../config/constants.mjs'; 

const updateProducts = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Update all existing users
        await User.updateMany({}, {
            $set: { coins : 1000 }
        });

        console.log('Users updated successfully.');
    } catch (error) {
        console.error('Error updating users:', error);
    } finally {
        mongoose.connection.close();
    }
};

updateProducts();