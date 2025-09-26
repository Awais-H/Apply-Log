import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import appRoutes from './routes/applyRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for your frontend domain
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Your frontend URL on Render
    credentials: true
}));

app.use(express.json())

//Routes
app.use('/auth', authRoutes)
app.use('/applications', authMiddleware, appRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
