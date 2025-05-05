
import arcjet, {tokenBucket, shield, detectBot} from "@arcjet/node";

import { config } from "dotenv";

config();

export const arcjetClient = arcjet({
    key: process.env.ARCJET_API_KEY,
    characteristics: ['ip.src'],
    rules: [
        shield({
            mode: 'LIVE',
        }),
        detectBot({
            mode: 'LIVE',
            allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:SEARCH_ENGINE_BOT'],
            block: ['CATEGORY:BAD_BOT', 'CATEGORY:SPAM_BOT'],
        }),
        tokenBucket({
            mode: 'LIVE',
            refillRate: 10,
            interval: 10,
            capacity: 10,}),
    ]
    })

