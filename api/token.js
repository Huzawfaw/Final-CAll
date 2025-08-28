const twilio = require('twilio');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identity, company } = req.body || {};
    
    if (!identity || !company) {
      return res.status(400).json({ error: 'Missing identity or company' });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const appSid = process.env.TWILIO_APP_SID;

    if (!accountSid || !apiKey || !apiSecret || !appSid) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        missing: {
          accountSid: !accountSid,
          apiKey: !apiKey,
          apiSecret: !apiSecret,
          appSid: !appSid
        }
      });
    }

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
    console.error('Token generation error:', error);
    return res.status(500).json({ 
      error: 'Token generation failed',
      details: error.message 
    });
  }
}
