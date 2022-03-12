import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
	const client = await MongoClient.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
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
