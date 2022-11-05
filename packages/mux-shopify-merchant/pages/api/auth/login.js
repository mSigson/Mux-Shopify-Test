import Shopify, { ApiVersion } from "@shopify/shopify-api"

const {API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST, HOST_SCHEME} = process.env;

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST.replace(/https?:\/\//, ''),
  HOST_SCHEME,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.October22
});

export default async function handler(req, res) {
  const authRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    req.query.shop,
    '/api/auth/callback',
    true,
  );

  return res.status(200).json({ authRoute });
}
