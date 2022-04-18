import mongoose from 'mongoose';

const MONGO_URI: string = process.env.MONGO_URI as string;

export async function connectToDatabase() {
	const client = await mongoose.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log('I Am Connected to Mongo...')
	return client;
}

// const MONGO_URI: string = process.env.MONGO_URI as string;

// const options: ConnectionOptions = {
//     useFindAndModify: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useNewUrlParser: true
// }

// export const connectToDatabase = () => connect(MONGO_URI, options)
