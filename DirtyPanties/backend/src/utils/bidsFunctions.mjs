import mongoose from "mongoose";
import Product from "../mongoose/schemas/Product.mjs";

export async function placeBid(productId, bid, userId) {
    try {
      // Update the product document by pushing a new bid into the bid array
      const result = await Product.findByIdAndUpdate(
        productId, // The ID of the product to update
        {
          $push: {
            bid: {
              amount: bid,
              bidderId: userId,
              date: new Date() // Use the current date
            }
          }
        },
        { new: true, useFindAndModify: false } // Return the updated document
      );
  
      console.log('Updated Product:', result);
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  }