const express = require('express');
const bodyParser = require('body-parser');
const mineflayer = require('mineflayer');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// API endpoint to start the bot
app.post('/start-bot', (req, res) => {
    const { serverIp, serverPort } = req.body;
    if (serverIp && serverPort) {
        try {
            // Create the bot and connect to the Minecraft server
            const bot = mineflayer.createBot({
                host: serverIp,        // Server IP
                port: serverPort,      // Server port
                username: 'Bot'        // Bot username
            });

            bot.on('spawn', () => {
                console.log(`Bot connected to server ${serverIp}:${serverPort}`);
                res.status(200).json({
                    message: `Bot successfully connected to server ${serverIp}:${serverPort}`
                });
            });

            bot.on('error', (err) => {
                console.error('Error while connecting to server:', err);
                res.status(500).json({ error: 'Failed to connect to the server!' });
            });

            bot.on('end', () => {
                console.log('Bot disconnected.');
            });
        } catch (error) {
            console.error('Error starting the bot:', error);
            res.status(500).json({ error: 'Failed to start the bot' });
        }
    } else {
        res.status(400).json({ error: 'IP or port not provided!' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
