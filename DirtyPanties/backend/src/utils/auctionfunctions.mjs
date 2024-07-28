// auctionHandler.mjs
import Product from '../mongoose/schemas/Product.mjs';
import User from '../mongoose/schemas/User.mjs';
import schedule from 'node-schedule';
import { sendWinningNotification } from './notificationsFunctions.mjs';

export const endAuction = async (product) => {
  try {
    product.isSold = true;
    await product.save();
    const winnerId = product.bid.bidderId;
    const user = await User.findById(winnerId);

    if (!user) {
      console.log(`User not found for product ${product._id}`);
      return;
    }

    await sendWinningNotification(product);
    console.log(`Auction ended for product ${product._id}, notification sent to user ${user._id}`);
  } catch (error) {
    console.error(`Error in endAuction for product ${product._id}:`, error);
  }
};

export const scheduleAuctionEnd = async (productId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      console.log(`Product not found for ID ${productId}`);
      return;
    }

    schedule.scheduleJob(product.auctionDate, async () => {
      await endAuction(product);
      console.log(`End of Auction scheduled for product ${product.name} (ID: ${product._id})`);
    });

    console.log(`Auction end job scheduled for product ${product.name} (ID: ${product._id}) on ${product.auctionDate}`);
  } catch (error) {
    console.error(`Error in scheduleAuctionEnd for product ${productId}:`, error);
  }
};

export const initializeScheduledTasks = async () => {
  try {
    const pendingAuctions = await Product.find({
      isSold: false,
      auctionDate: { $gt: new Date() }
    });

    pendingAuctions.forEach(product => {
      scheduleAuctionEnd(product._id);
    });

    console.log(`Scheduled tasks initialized for ${pendingAuctions.length} pending auctions.`);
  } catch (error) {
    console.error('Error in initializeScheduledTasks:', error);
  }
};
