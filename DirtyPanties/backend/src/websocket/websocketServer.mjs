import { WebSocketServer, WebSocket } from "ws";
import Product from '../mongoose/schemas/Product.mjs';
import User from '../mongoose/schemas/User.mjs'; 

const PORT = process.env.WS_PORT || 8080;

const wss = new WebSocketServer({port : PORT});

//Pour enregistrer les connexions pour chaques produits
const clientSubscriptions = {};
const userConnections = {};

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
                            images: product.images
                        }
                    }));
                };
            };
        };
    });

    ws.on('close', () => {
    console.log('Client disconnected');
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

export {wss, getClientSubscription, sendHighestBidUpdate};
