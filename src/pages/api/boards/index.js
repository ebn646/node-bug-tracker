import { connectToDatabase } from '../../../../lib/db';
import nc from 'next-connect';
import { ObjectId } from 'mongodb';

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

    let projects = await db
      .collection("boards")
      .aggregate([
        {
          $match: {
            userId : new ObjectId(req.query.id)
          }
        }
      ])
      .toArray();
  
    res.json( projects );
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
      const board = {
        ...data,
        userId: new ObjectId(data.userId),
        createdAt: new Date(),
      };
      const { insertedId } = await db.collection('boards').insertOne(board);
      board._id = insertedId;
      res.json( board );
    }
  );

  export default handler;