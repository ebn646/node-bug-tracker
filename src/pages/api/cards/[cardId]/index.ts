import { connectToDatabase } from '../../../../../lib/db';
import nc from 'next-connect';
import { ObjectId } from 'mongodb';
import { update } from 'lodash';

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
  const { cardId } = req.query;

 
  let card = await db
    .collection("cards")
    .aggregate([
      {
        $match: {
          _id: new ObjectId(cardId)
        }
      }
    ])
    .toArray();
  res.json(card[0]);
});

handler.patch(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();
  var updateObject = req.body;
  let obj;
  if (updateObject['listId']) {
    obj = {
      ...updateObject,
      listId: new ObjectId(updateObject.listId),
    }
  } else {
    obj = { ...updateObject }
  }
  let card = await db
    .collection("cards")
    .updateOne({ _id: new ObjectId(req.query.cardId) }, { $set: obj })
  res.json(card);
});

handler.delete(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();

  let card = await db
    .collection("cards")
    .deleteOne({ _id: new ObjectId(req.query.cardId) })
  res.json(card);
})



export default handler;
