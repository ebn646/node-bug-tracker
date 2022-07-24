import { MongoClient } from 'mongodb';

const MONGO_URI: string = process.env.MONGO_URI as string;

export async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    console.log('I Am Connected to Mongo...');
    return client;
  } catch (err) {
    console.log(err);
  }
}

// const MONGO_URI: string = process.env.MONGO_URI as string;

// const options: ConnectionOptions = {
//     useFindAndModify: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useNewUrlParser: true
// }

// export const connectToDatabase = () => connect(MONGO_URI, options)
