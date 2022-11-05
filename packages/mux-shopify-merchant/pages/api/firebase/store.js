import db from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { store, isLive, featuredItemId } = req.query;
    const storeRef = await db.collection('stores').doc(store);

    const stateObj = {
      name: store,
      playbackId: process.env.MUX_PLAYBACK_ID
    }

    if (isLive) {
      stateObj.isLive = isLive === "true"
    }

    if (featuredItemId) {
      stateObj.featuredItemId = featuredItemId
    }

    await storeRef.set(stateObj, { merge: true });
    return res.status(200)
  }
}