export function trackLastVisit(req, res, next) {
  const previous = req.cookies?.lastVisit;
  req.lastVisit = previous && !Number.isNaN(Date.parse(previous)) ? new Date(previous) : null;
  res.cookie('lastVisit', new Date().toISOString(), {
    maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax'
  });
  next();
}
