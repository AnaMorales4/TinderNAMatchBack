const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const authRoutes =require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const connectDB = require('./db');
 
const http = require('http');
const { Server } = require('socket.io');
const socketController = require('./controllers/socketController');
 
//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./documentation/swagger');
 
 
const app = express();
dotenv.config();
 
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
 
const PORT = process.env.PORT || 5000;
 
//Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static(path.join(__dirname, 'public')));
 
//Routes
app.use('/api/users', userRoutes);
//app.use("/chat", chatRoutes);
app.use('/api', authRoutes);
 
try {
    connectDB().then();
}catch (e) {
    console.log(e)
}
 
socketController(io);
 
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});