import bcrypt from 'bcryptjs';

const users = [];
let nextUserId = 1;

export async function createUser({ name, email, password, role }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  if (users.some(user => user.email === normalizedEmail)) {
    return { ok: false, message: 'An account with this email already exists.' };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: String(nextUserId++), name: String(name).trim(), email: normalizedEmail,
    passwordHash, role, createdAt: new Date()
  };
  users.push(user);
  return { ok: true, user: publicUser(user) };
}

export async function authenticateUser(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = users.find(item => item.email === normalizedEmail);
  if (!user || !(await bcrypt.compare(String(password || ''), user.passwordHash))) return null;
  return publicUser(user);
}

export function findUserById(id) {
  const user = users.find(item => item.id === String(id));
  return user ? publicUser(user) : null;
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
}
