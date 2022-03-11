import { hashPassword } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;
  console.log(req.body)
  const { firstName, lastName, email, password } = data;

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      error: "auth-0001",
      message: 'Invalid input - password should also be at least 7 characters long.',
    });
    throw new Error('No user found!');
  }

  const client = await connectToDatabase();

  const db = client.db();

  const existingUser = await db.collection('users').findOne({ email: email });

  if (existingUser) { 
    res.status(403).json({error: true, message: 'Email exists'});
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection('users').insertOne({
    firstName: firstName,
    lastName: lastName, 
    email: email,
    password: hashedPassword,
  });

  res.send({ status: 201, result: result });
  client.close();
}

export default handler;
