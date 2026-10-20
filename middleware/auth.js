export function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    req.session.flash = { type: 'info', message: 'Please log in to continue.' };
    return res.redirect('/login');
  }
  next();
}
export function isRecruiter(req, res, next) {
  if (!req.session.user) {
    req.session.flash = { type: 'info', message: 'Please log in as a recruiter to continue.' };
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'recruiter') return res.status(403).render('error', { title: 'Access denied', status: 403, message: 'This action is available to recruiters only.' });
  next();
}
export function isJobSeeker(req, res, next) {
  if (!req.session.user) {
    req.session.flash = { type: 'info', message: 'Please log in as a job seeker to continue.' };
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'jobseeker') return res.status(403).render('error', { title: 'Access denied', status: 403, message: 'This action is available to job seekers only.' });
  next();
}
