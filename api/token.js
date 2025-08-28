export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Dynamic import to avoid serverless issues
    const twilio = await import('twilio');
    
    const { identity, company } = req.body || {};
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const appSid = process.env.TWILIO_APP_SID;

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: appSid,
      incomingAllow: true,
    });

    const token = new AccessToken(accountSid, apiKey, apiSecret, {
      identity: identity,
      ttl: 3600
    });

    token.addGrant(voiceGrant);

    return res.status(200).json({
      identity: identity,
      token: token.toJwt(),
      company: company
    });

  } catch (error) {
    console.error('Token error:', error);
    return res.status(500).json({ 
      error: 'Token generation failed',
      details: error.message,
      stack: error.stack?.substring(0, 200)
    });
  }
}
