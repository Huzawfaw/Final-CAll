const twilio = require('twilio');

export default function handler(req, res) {
    // CORS headers
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
        const { identity, company } = req.body;

        // Environment variables
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const apiKey = process.env.TWILIO_API_KEY;
        const apiSecret = process.env.TWILIO_API_SECRET;
        const appSid = process.env.TWILIO_APP_SID;

        console.log('🔑 Token request for:', identity, company);

        // Validate required parameters
        if (!identity || !company) {
            return res.status(400).json({ error: 'Missing identity or company' });
        }

        // Validate environment variables
        if (!accountSid || !apiKey || !apiSecret || !appSid) {
            console.error('❌ Missing Twilio credentials');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Create access token
        const { jwt } = twilio;
        const { AccessToken } = jwt;
        const { VoiceGrant } = AccessToken;

        const accessToken = new AccessToken(accountSid, apiKey, apiSecret, {
            identity: identity,
            ttl: 3600 // 1 hour
        });

        // Create voice grant
        const voiceGrant = new VoiceGrant({
            outgoingApplicationSid: appSid,
            incomingAllow: true
        });

        // Add grant to token
        accessToken.addGrant(voiceGrant);

        // Generate JWT
        const token = accessToken.toJwt();

        console.log('✅ Token generated for:', identity);

        return res.json({
            token: token,
            identity: identity,
            company: company
        });

    } catch (error) {
        console.error('❌ Token generation error:', error);
        return res.status(500).json({ 
            error: 'Failed to generate token',
            details: error.message 
        });
    }
}