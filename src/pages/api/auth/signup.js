import { hashPassword } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;
  console.log(req.body)
  const { email, username, password } = data;
  console.log('e', email, 'u ', username, 'p ', password)

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 4
  ) {
    res.status(422).json({
      message:
        'Invalid input - password should also be at least 7 characters long.',
    });
    res.send({ status: 422, message:  'Invalid input - password should also be at least 7 characters long.' });
    client.close();
    return ;
  }

  const client = await connectToDatabase();

  const db = client.db();

  const existingUser = await db.collection('users').findOne({ email: email });

  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    res.send({ status: 422, message: 'User exists already!' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection('users').insertOne({
    email: email,
    password: hashedPassword,
  });

  res.send({ status: 201, message: null });
  client.close();
}

export default handler;
