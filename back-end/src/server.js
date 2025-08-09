import 'dotenv/config'
import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import appRoutes from './routes/applyRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json())
// Serve Vite's dist folder
app.use(express.static(path.join(__dirname, '..', '..', 'front-end', 'dist')));

// SPA fallback
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'front-end', 'dist', 'index.html'));
});

//Routes
app.use('/auth', authRoutes)
app.use('/applications', authMiddleware, appRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
