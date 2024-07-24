import mongoose from 'mongoose';
import Product from '../mongoose/schemas/Product.mjs'; 
import { MONGO_URI } from '../config/constants.mjs'; 

const updateProducts = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Update all existing products to include the new bid property with default values
        await Product.updateMany({}, {
            $set: { bid: {date:new Date(), amount: 0, bidderId: '' } }
        });

        console.log('Products updated successfully.');
    } catch (error) {
        console.error('Error updating products:', error);
    } finally {
        mongoose.connection.close();
    }
};

updateProducts();