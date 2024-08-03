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

  const authorizationUri = client.authorizeURL({
    redirect_uri: 'https://worldlynk-stripe-server.netlify.app/.netlify/functions/auth-callback',
    scope: 'https://graph.microsoft.com/Mail.Send',
  });

  return {
    statusCode: 302,
    headers: {
      Location: authorizationUri,
    },
    body: '',
  };
};
