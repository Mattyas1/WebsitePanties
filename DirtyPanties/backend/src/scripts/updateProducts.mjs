import '../config/env.mjs'

import mongoose from 'mongoose';
import Product from '../mongoose/schemas/Product.mjs'; 

const MONGO_URI = process.env.MONGO_URI;

const updateProducts = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Update all existing products to include the new bid property with default values
        await Product.updateMany({}, {
            $set: { isSold: 'false' }
        });

        console.log('Products updated successfully.');
    } catch (error) {
        console.error('Error updating products:', error);
    } finally {
        mongoose.connection.close();
    }
};

updateProducts();