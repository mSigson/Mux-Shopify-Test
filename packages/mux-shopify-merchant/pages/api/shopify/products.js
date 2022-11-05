import Shopify from "@shopify/shopify-api"
import {Product} from '@shopify/shopify-api/dist/rest-resources/2022-10/index.js';

export default async function handler(req, res) {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const products = await Product.all({ session });
    return res.status(200).json({ products });
  } catch (e) {
    return res.redirect('/login'); 
  }
}