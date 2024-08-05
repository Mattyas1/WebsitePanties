import { sendEmail } from "./mailsFunction.mjs";
import {sendNotificationUpdate} from '../websocket/websocketServer.mjs'


export const sendWinningNotification = async (winner, product) => {
    try {
    if (!winner) {
        console.log("The winner of the product ", product._id, " was not passed");
        return null
    };
    const message = `You just won the following Auction: ${product.name}.  Check your email for more information`
    await sendNotificationUpdate(winner, message);

    const winnerMailSubject = `Congratulation on winning ${product.name}`;
    const winnerMailText = `The auction just terminated and you are officially the winner of the following product: ${product.name}
     for the price of : ${product.bid.amount} $!  You will soon be informed details about the delivery of your product from
     our shipping team. Well done and good luck for futur auctions ;)`;
    await sendEmail(winner.email,winnerMailSubject, winnerMailText );
    console.log (`Winning email sent to ${winner.email} for product ${product._id}`);

    const deliveryMailSubject = `Product ${product.name} won by ${winner.username}`;
        const deliveryMailText = `
            The product ${product.name} has been won by ${winner.username} for ${product.bid.amount} $.
            Please arrange for delivery.
        `;
        const deliveryStaffEmail = "delivery@company.com"; 
        // Activate this part when having a delivery mail.
        /* await sendEmail(deliveryStaffEmail, deliveryMailSubject, deliveryMailText); */ 
        console.log(`Delivery notification sent for product ${product._id}`);

    return true;
    } catch (error) {
        console.log(`An error occurred sending notification to the winner of ${product.name}: `, error);
        return null
    }
}