import { connectToDatabase } from '../../../../../lib/db';
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

// handler.get('/:id', async(req,res) => {
//     console.log('FUCKER', req)
//     let client = await connectToDatabase();
//     let db = client.db();
//     const { id } = req.query;

    
//     let lists = await db
//       .lists.find(
//         { _id: { $in: [ 5, ObjectId("61eded116eb36158a18bd024") ] } }
//      )
  
  
//     res.json( lists );
// });

handler.get(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();

  let lists = await db
    .collection("cards")
    .find()
    .toArray();

  res.json( lists );
});

export default handler;

// import posts from "./posts.json";

// export default async (req, res) => {
//     const post = posts.find(({ id }) => id === req.query.projectId);
//   console.log('1154545454')
//     if (post) {
//         res.status(200).json({ message: "success", post });
//     } else {
//         res.status(400).json({ message: "post not found" });
//     }
// }