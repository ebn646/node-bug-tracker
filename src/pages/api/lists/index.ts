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
  const { query: { boardid }} = req;
    let client = await connectToDatabase();
    let db = client.db();

    let lists = await db
      .collection("lists")
      .aggregate([
        {
          $match: {
            boardId : new ObjectId(boardid),
          }
        }
      ])
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
      const { query : { id }} = req;
      let client = await connectToDatabase();
      let db = client.db();
      const data = req.body;
      console.log('data = ', data)

      const list = {
        ...data,
        boardId: new ObjectId(data.boardId),
        createdAt: new Date(),
      };
      const { insertedId } = await db.collection('lists').insertOne(list);
      list._id = insertedId;
      res.json( list );
    }
  );

  export default handler;