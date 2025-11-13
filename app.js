const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');


const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const connectDB = require('./db');


//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./documentation/swagger');

dotenv.config();

const app = express();

//un puerto para la API: Puse el que tenemos en la imagen de la arquitectura jeje
const PORT = process.env.API_PORT || process.env.PORT || 8000;

//Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true
  }));

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/users', userRoutes);
//app.use("/chat", chatRoutes);
app.use('/api', authRoutes);

async function startApi() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`API server running at http://localhost:${PORT} this is a commit test`);
    });
  } catch (e) {
    console.error('Error starting API server:', e);
    process.exit(1);
  }
}

startApi();