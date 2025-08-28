const twilio = require('twilio');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { To, From } = req.body;
        console.log('📞 Voice webhook:', { To, From });

        const twiml = new twilio.twiml.VoiceResponse();

        if (To) {
            // Outgoing call
            console.log('📤 Outgoing call to:', To);
            twiml.dial({
                callerId: From
            }, To);
        } else {
            // Fallback
            twiml.say('Hello from Twilio');
        }

        res.setHeader('Content-Type', 'text/xml');
        return res.send(twiml.toString());

    } catch (error) {
        console.error('❌ Voice webhook error:', error);
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('Sorry, there was an error processing your call.');
        res.setHeader('Content-Type', 'text/xml');
        return res.send(twiml.toString());
    }
}