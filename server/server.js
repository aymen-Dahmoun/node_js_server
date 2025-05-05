import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './productRoutes/ProductRoutes.js';
import { db } from './config/database.js';
import { arcjetClient } from './lib/arcjet.js';

dotenv.config();
const PORT = process.env.PORT || 3001;
console.log('PORT', PORT)
const app = express();

app.use(express.json());
app.use(cors())
app.use(morgan('dev'));
app.use(helmet());
app.use(async (req, res, next) => {
    try {
        const decision = await arcjetClient.protect(req, {
            requested: 1,
        })
        if (decision.isDenied) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: 'Too many requests' });
            }
            else if (decision.reason.isBot()) {
                return res.status(403).json({ error: 'Bot detected' });
            }
            else if (decision.reason.isShield()) {
                return res.status(403).json({ error: 'Shielded request' });
            }

        }
        next();
    } catch (error) {
        console.error('Error in middleware:', error);
        }
    }
)
app.use("/api/products", router);
async function initDb() {
    try {
        await db`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`
    }
    catch (error) {
        console.error('Error initializing database:', error);
    }
    console.log('Database initialized successfully!');
}
app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log(res.getHeaders());
}
);

initDb().then(() => {
app.listen(PORT, () => {
    console.log('Server is running on port 3000');
  });
    }
)