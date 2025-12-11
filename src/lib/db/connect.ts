import mongoose from 'mongoose';

if(!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
}

async function connectDB(){
    try{
        if(mongoose.connection.readyState === 1) {
            console.log('Already connected to MongoDB');
            return mongoose.connection;
        }
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');
        return mongoose.connection;
    } catch(error){
        console.error('Error connecting to MongoDB', error);
        throw error;
    }
}
export default connectDB;