import { connectToDatabase } from '../../../../lib/db';
import nc from 'next-connect';

const ncOpts = {
    onError(err, req, res) {
      console.error(err);
      res.statusCode =
        err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
      res.json({ message: err.message });
    },
  };

const handler = nc(ncOpts);

handler.get(async (req, res) => {
    let client = await connectToDatabase();
    let db = client.db();

    let lists = await db
      .collection("lists")
      .find()
      .toArray();
  
    res.json( lists );
  });

  handler.post(
    // ...auths,
    // validateBody({
    //   type: 'object',
    //   properties: {
    //     content: ValidateProps.post.content,
    //   },
    //   required: ['content'],
    //   additionalProperties: false,
    // }),
    async (req, res) => {
      let client = await connectToDatabase();
      let db = client.db();
      const data = req.body;
      const list = {
        ...data,
        ...{createdAt: new Date()},
      };
      const { insertedId } = await db.collection('lists').insertOne(list);
      list._id = insertedId;
      res.json( list );
    }
  );

  export default handler;