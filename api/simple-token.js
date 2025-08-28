export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { identity, company } = req.body || {};
  
  // Return a mock token for testing
  return res.status(200).json({
    identity: identity || 'test',
    company: company || 'test',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTSzEyMzQiLCJleHAiOjE2MzQ1Njc4OTB9.test',
    message: 'Mock token for testing'
  });
}
