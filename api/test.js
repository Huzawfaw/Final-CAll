export default function handler(req, res) {
  res.json({ 
    message: 'API is working!',
    env: {
      hasAccountSid: !!process.env.TWILIO_ACCOUNT_SID,
      hasApiKey: !!process.env.TWILIO_API_KEY,
      hasApiSecret: !!process.env.TWILIO_API_SECRET,
      hasAppSid: !!process.env.TWILIO_APP_SID
    }
  });
}
