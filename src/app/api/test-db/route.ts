import connectDB from '@/lib/db/connect';
import { NextResponse } from 'next/server';

export async function GET(){
    console.log('Testing database connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    try{
        const db = await connectDB();
        return NextResponse.json({ message: 'Connected to MongoDB' }, { status: 200 });
    } catch(error){
        return NextResponse.json({ error: 'Failed to connect to MongoDB', details: error }, { status: 500 });
    }
}