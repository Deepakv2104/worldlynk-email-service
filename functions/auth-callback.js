const { AuthorizationCode } = require('simple-oauth2');

exports.handler = async (event, context) => {
  const client = new AuthorizationCode({
    client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'https://login.microsoftonline.com',
      authorizePath: '/common/oauth2/v2.0/authorize',
      tokenPath: '/common/oauth2/v2.0/token',
    },
  });

  const { code } = event.queryStringParameters;

  try {
    const tokenParams = {
      code,
      redirect_uri: 'https://worldlynk-stripe-server.netlify.app/.netlify/functions/auth-callback',
    };

    const accessToken = await client.getToken(tokenParams);

    // Save the tokens securely
    console.log('Access Token:', accessToken);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Authorization successful', tokens: accessToken }),
    };
  } catch (error) {
    console.error('Access Token Error', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed' }),
    };
  }
};
