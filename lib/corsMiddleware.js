import Cors from 'cors';
import { NextResponse } from 'next/server';

// Allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000', // Local development
    'https://livingbranddashboard.vercel.app', // Production URL
];

// Initialize the CORS middleware
const cors = Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
});

// Helper method to run middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function corsMiddleware(req) {
    // Create a NextResponse object
    const res = NextResponse.next(); // This creates the response object for Next.js

    try {
        // Run the CORS middleware
        await runMiddleware(req, res, cors);

        // Set the necessary CORS headers
        const origin = allowedOrigins.includes(req.headers.get('origin')) ? req.headers.get('origin') : allowedOrigins[0];
        res.headers.set('Access-Control-Allow-Origin', origin);
        res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return NextResponse.json({}, { status: 204 }); // Respond with 204 No Content
        }

        return res; // Return the response for other requests
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'CORS Error' }, { status: 500 });
    }
}
