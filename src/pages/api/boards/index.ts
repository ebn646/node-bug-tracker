import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../../lib/db';
import nc from 'next-connect';
import { ObjectId } from 'mongodb';

const ncOpts = {
    onError(err: {status: number, message: string}, res: NextApiResponse) {
      console.error(err);
      res.statusCode =
        err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
      res.json({ message: err.message });
    },
  };

const handler = nc(ncOpts);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    let client = await connectToDatabase();
    let db = client.db();
    let id = req.query.id as string;

    let board = await db
      .collection("boards")
      .aggregate([
        {
          $match: {
            workspaceId : new ObjectId(id)
          }
        }
      ])
      .toArray();
  
    res.json( board[0] );
  });

  handler.post(
    async (req: NextApiRequest, res: NextApiResponse) => {
      let client = await connectToDatabase();
      let db = client.db();
      let id = req.query.id as string;
      const data = req.body;
      const board = {
        ...data,
        workspaceId: new ObjectId(id),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const { insertedId } = await db.collection('boards').insertOne(board);
      board._id = insertedId;
      res.json( board );
    }
  );

  export default handler;