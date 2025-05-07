import bcrypt from 'bcryptjs';
import { db } from '../config/database.js';


export const createUser = async (email, password, name, role) => {
    // console.log('name', name)
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log('hashedPassword', hashedPassword)
        const res = await db`
            INSERT INTO users (email, password, name, role) VALUES (${email}, ${hashedPassword}, ${name}, ${role}) RETURNING *`;
        // console.log('res', res);
        return res[0];
    } catch (error) {
        console.log('Error creating user:', error);
        return error;
    }
}

export const getUserByEmail = async (email) => {
    try {
        const res = await db`SELECT * FROM users WHERE email = ${email}`;
        // console.log('res', res)
        if (res.length === 0) {
            return false;
        }
        return res[0];
    } catch (error) {
        return false;
    }
}