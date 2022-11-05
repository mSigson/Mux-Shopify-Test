import Shopify from "@shopify/shopify-api"

export default async function handler(req, res) {
  try {
    await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query,
    );

    return res.redirect('/live'); 
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
}
