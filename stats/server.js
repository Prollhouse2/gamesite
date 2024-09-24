const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3434; // Change to port 3434

const server = http.createServer(app);
const io = socketIo(server);

const onlineUsers = {};

// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Example Socket.IO namespace
io.of('/domain1').on('connection', (socket) => {
    onlineUsers['domain1'] = (onlineUsers['domain1'] || 0) + 1;
    io.of('/domain1').emit('updateUserCount', onlineUsers['domain1']);

    socket.on('disconnect', () => {
        onlineUsers['domain1']--;
        io.of('/domain1').emit('updateUserCount', onlineUsers['domain1']);
    });
});

// Start the HTTP server
server.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});
