export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  // Stateless Hardcoded Credentials for Launch
  const credentials = {
    'admin': { pass: 'admin123', role: 'manager', name: 'Executive Manager' },
    'kitchen': { pass: 'kitchen123', role: 'kitchen', name: 'Head Chef' },
    'guest': { pass: 'guest', role: 'customer', name: 'Valued Guest' }
  };

  const normalizedUsername = (username || '').toLowerCase().trim();
  const user = credentials[normalizedUsername];

  if (user && user.pass === password) {
    return res.status(200).json({ 
      success: true, 
      user: { 
        id: normalizedUsername, 
        name: user.name, 
        role: user.role 
      } 
    });
  }

  return res.status(401).json({ 
    success: false, 
    error: 'Invalid username or password' 
  });
}
