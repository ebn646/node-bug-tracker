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

handler.get('/:id', async(req,res) => {
    let client = await connectToDatabase();
    let db = client.db();
    const { cardId } = req.query;

    let lists = await db
      .cards.find(
        { _id: { $in: [ 5, new ObjectId(cardId) ] } }
     )
    res.json( lists );
});

handler.get(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();

  let cards = await db
    .collection("cards")
    .find()
    .toArray();
  res.json( cards );
});

handler.patch(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();
  var updateObject = req.body;
  console.log('update obj = ', updateObject)
  let obj;
  if(updateObject['listId']){
    obj = {
      ...updateObject,
      listId: new ObjectId(updateObject.listId),
    }
  } else {
    obj = {...updateObject}
  }

  console.log('obj = ', obj)

  let card = await db
    .collection("cards")
    .updateOne({_id: new ObjectId(req.query.cardId)}, {$set: obj })
  res.json( card );
});

handler.delete(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();

  let card = await db
    .collection("cards")
    .deleteOne({_id: new ObjectId(req.query.cardId)})
  res.json( card );
})



export default handler;
