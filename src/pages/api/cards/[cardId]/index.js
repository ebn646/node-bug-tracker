import { connectToDatabase } from '../../../../../lib/db';
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

handler.get('/:id', async(req,res) => {
    let client = await connectToDatabase();
    let db = client.db();
    const { id } = req.query;

    
    let lists = await db
      .lists.find(
        { _id: { $in: [ 5, ObjectId(req.query.cardId) ] } }
     )
    res.json( lists );
});

handler.get(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();

  let lists = await db
    .collection("cards")
    .find()
    .toArray();
  res.json( lists );
});

handler.patch(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();
  var updateObject = req.body;
  console.log(req.body, req.query.cardId)
  let card = await db
    .collection("cards")
    .updateOne({_id: ObjectId(req.query.cardId)}, {$set: updateObject })
  res.json( card );
});

handler.delete(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();

  let card = await db
    .collection("cards")
    .deleteOne({_id: ObjectId(req.query.cardId)})
  res.json( card );
})



export default handler;
