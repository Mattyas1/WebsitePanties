import '../config/env.mjs';
import mongoose from 'mongoose';
import User from '../mongoose/schemas/User.mjs';


const migrateUsers = async () => {
    try {
        // Connect to your MongoDB
        await mongoose.connect('mongodb://localhost:27017/DirtyPanties', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Find all users with the 'coins' property
        const users = await User.find({ 'coins': { $exists: true } });

        for (const user of users) {
            // Convert coins to dollars
            const amountInDollars = user.coins
            console.log(user.coins)

            // Update the user with the new wallet property
            user.wallet = {
                amount: amountInDollars
            };

            // Remove the old 'coins' property
            user.coins = undefined;

            await user.save();
            console.log(`Updated user ${user._id} with $${amountInDollars}`);
        }

        console.log('Migration completed');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        mongoose.disconnect();
    }
};

migrateUsers();
