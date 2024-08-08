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

        // Find all users
        const users = await User.find();

        for (const user of users) {
            // Set default settings if not already present
            if (!user.settings) {
                user.settings = {
                    language: 'en',
                    notifications: true,
                    emailUpdates: true,
                };
            } else {
                // Ensure each setting has a default value if not present
                user.settings.language = user.settings.language || 'en';
                user.settings.notifications = user.settings.notifications !== undefined ? user.settings.notifications : true;
                user.settings.emailUpdates = user.settings.emailUpdates !== undefined ? user.settings.emailUpdates : true;
            }

            await user.save();
            console.log(`Updated user ${user._id} with settings: ${JSON.stringify(user.settings)}`);
        }

        console.log('Migration completed');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        mongoose.disconnect();
    }
};

migrateUsers();
