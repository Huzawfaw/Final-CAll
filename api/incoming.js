const twilio = require('twilio');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { From, To } = req.body;
        console.log('📞 Incoming call:', { From, To });

        const twiml = new twilio.twiml.VoiceResponse();

        // Phone numbers for company identification
        const phoneNumbers = {
            connectiv: process.env.CONNECTIV_PHONE,
            booksnpayroll: process.env.BOOKSNPAYROLL_PHONE
        };

        // Determine company based on called number
        let company = 'unknown';
        if (To === phoneNumbers.connectiv) {
            company = 'connectiv';
        } else if (To === phoneNumbers.booksnpayroll) {
            company = 'booksnpayroll';
        }

        console.log('🏢 Company identified:', company);

        // Route to available agents
        const dial = twiml.dial({
            timeout: 30,
            record: 'record-from-ringing'
        });

        // Try to connect to available extensions
        if (company === 'connectiv') {
            dial.client('ext_101'); // Reception
        } else if (company === 'booksnpayroll') {
            dial.client('ext_201'); // Accounting
        } else {
            // Fallback
            twiml.say('Thank you for calling. Please hold while we connect you.');
            dial.client('ext_101');
        }

        res.setHeader('Content-Type', 'text/xml');
        return res.send(twiml.toString());

    } catch (error) {
        console.error('❌ Incoming webhook error:', error);
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('Sorry, we cannot connect you at the moment. Please try again later.');
        res.setHeader('Content-Type', 'text/xml');
        return res.send(twiml.toString());
    }
}