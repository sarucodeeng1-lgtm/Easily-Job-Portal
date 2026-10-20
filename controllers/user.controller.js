import { createUser, authenticateUser } from '../models/user.model.js';

export function showRegisterPage(req, res) { res.render('register', { title: 'Create account', error: null, values: {} }); }
export function showLoginPage(req, res) { res.render('login', { title: 'Log in', error: null, email: '' }); }
export async function register(req, res, next) {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const role = String(req.body.role || '');
    if (name.length < 2 || !email.includes('@') || password.length < 8 || !['jobseeker', 'recruiter'].includes(role)) {
      return res.status(400).render('register', { title: 'Create account', error: 'Enter a name, valid email, password with at least 8 characters, and select a role.', values: { name, email, role } });
    }
    const result = await createUser({ name, email, password, role });
    if (!result.ok) return res.status(409).render('register', { title: 'Create account', error: result.message, values: { name, email, role } });
    req.session.flash = { type: 'success', message: 'Account created. Please log in.' };
    res.redirect('/login');
  } catch (err) { next(err); }
}
export async function login(req, res, next) {
  try {
    const user = await authenticateUser(req.body.email, req.body.password);
    if (!user) return res.status(401).render('login', { title: 'Log in', error: 'Email or password is incorrect.', email: req.body.email || '' });
    req.session.regenerate(err => {
      if (err) return next(err);
      req.session.user = user;
      req.session.flash = { type: 'success', message: `Welcome back, ${user.name}!` };
      res.redirect(user.role === 'recruiter' ? '/dashboard' : '/jobs');
    });
  } catch (err) { next(err); }
}
export function logout(req, res, next) {
  req.session.destroy(err => {
    if (err) return next(err);
    res.clearCookie('easily.sid');
    res.redirect('/');
  });
}
