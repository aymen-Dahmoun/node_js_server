import bcrypt from 'bcryptjs';
import { db } from '../config/database.js';


export const createUser = async (email, password, name, role) => {
    try {
        const hassedPassword = await bcrypt.hash(password, 100);
        const res = await db`
            INSERT INTO users (email, password, name, role) VALUES (${email}, ${hassedPassword}, ${role}, ${name}) RETURNING *`;
        return res[0];
    } catch (error) {
        return error;
    }
}

export const getUserByEmail = async (email) => {
    try {
        const res = await db`SELECT * FROM users WHERE email = ${email}`;
        return res[0];
    } catch (error) {
        return false;
    }
}