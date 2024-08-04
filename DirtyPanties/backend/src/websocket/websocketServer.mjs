import { WebSocketServer, WebSocket } from "ws";
import Product from '../mongoose/schemas/Product.mjs';
import User from '../mongoose/schemas/User.mjs'; 

const PORT = process.env.WS_PORT || 8080;

const wss = new WebSocketServer({port : PORT});

const userConnections = {};
//Pour enregistrer les connexions pour chaques produits
const clientSubscriptions = {};

const sendNotificationUpdate = async (userId, message) => {
    const user = await User.findById(userId);

    if(user){
        const notification = {
            message,
            read : false,
            date: new Date(),
        };
        user.notifications.push(notification);
        await user.save();
        const updateMessage = JSON.stringify({
            type:'notificationUpdate',
            data: notification
        });
        if (userConnections[userId]){
            const client = userConnections[userId];
            if (client.readyState===WebSocket.OPEN) {
                client.send(updateMessage);
            }
        };
    }

}

//on connection of a new product: 
const sendHighestBidUpdate = async (productId) => {
    const product = await Product.findById(productId);

    if (product) {
        const updateMessage = JSON.stringify({
            type: 'productUpdate',
            data: {
                productId,
                highestBid: product.bid.amount,
            }
        });
        if (clientSubscriptions[productId]) {
            clientSubscriptions[productId].forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(updateMessage);
                }
            });
        }
    }
};

const getClientSubscription = () => {
    return clientSubscriptions
}


wss.on ('connection', async (ws) => {
    console.log("New client connected to WSS");

    ws.on('message', async (message) => {
        const msg = JSON.parse(message);

        //on Connection store user's ws in userConnections 
        if(msg.type === 'registerUser'){
            const {userId} = msg.data;
            if (userId){
                userConnections[userId] = ws;
                ws.send(JSON.stringify({
                    type: 'welcome',
                    data: {message: 'You are connected to the wss'}
                }));
            }
        }

        //when subscribing to a product, store user's ws in clientSubscriptions[productId]
        if (msg.type === 'subscribe') {
            const {productId} = msg.data;
            if(productId){
                if(!clientSubscriptions[productId]) {
                    clientSubscriptions[productId] = new Set();
                }
                clientSubscriptions[productId].add(ws);

                const product = await Product.findById(productId);
                if (product) {
                    ws.send(JSON.stringify({
                        type: 'productSet',
                        data: {
                            name: product.name,
                            description: product.description,
                            category: product.category,
                            auctionDate: product.auctionDate,
                            bid: product.bid,
                            images: product.images,
                            startingPrice: product.startingPrice,
                        }
                    }));
                };
            };
        };

        if (msg.type === 'notificationsRead') {
            const {userId} = msg.data;
            if(userId){
                const user = await User.findById(userId);
                if (user){
                    const updateNotifications = user.notifications.map(notification => 
                    notification.read ? notification : {...notification, read:true});
                    user.notifications = updateNotifications;
                    await user.save();
                }
            }
        }
    });

    ws.on('close', () => {
    console.log('Client disconnected');
    for (const userId in userConnections){
        if (userConnections[userId] === ws){
            delete userConnections[userId];
            break;
        }
    } 


    for (const productId in clientSubscriptions) {
      clientSubscriptions[productId].delete(ws);
      if (clientSubscriptions[productId].size === 0) {
        delete clientSubscriptions[productId];
      }
    }
  });

    ws.on('error', (err) => {
        console.error('WebScoket error:', err);
    });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

export {wss, getClientSubscription, sendHighestBidUpdate, sendNotificationUpdate};
