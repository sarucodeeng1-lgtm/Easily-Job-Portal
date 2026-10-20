import { createJob, getAllJobs, getJobById, getJobsByRecruiter, updateJob, deleteJob } from '../models/job.model.js';
import { getApplicationsByJob } from '../models/application.model.js';

export function showJobs(req, res) {
  const pageData = getAllJobs({ query: req.query.q || '', page: req.query.page || 1, limit: 6 });
  res.render('jobs', { title: 'Browse jobs', ...pageData });
}
export function showJobDetails(req, res) {
  const job = getJobById(req.params.id);
  if (!job) return res.status(404).render('error', { title: 'Job not found', status: 404, message: 'This job may have been removed.' });
  res.render('jobDetails', { title: job.title, job, applicationCount: getApplicationsByJob(job.id).length });
}
export function showDashboard(req, res) {
  const jobs = getJobsByRecruiter(req.session.user.id).map(job => ({ ...job, applicationCount: getApplicationsByJob(job.id).length }));
  res.render('dashboard', { title: 'Recruiter dashboard', jobs });
}
export function showCreateJobPage(req, res) { res.render('jobForm', { title: 'Post a job', heading: 'Post a new job', action: '/jobs', job: {}, error: null }); }
export function createJobPost(req, res) {
  const data = cleanJobInput(req.body);
  const error = validateJob(data);
  if (error) return res.status(400).render('jobForm', { title: 'Post a job', heading: 'Post a new job', action: '/jobs', job: data, error });
  createJob({ ...data, recruiterId: req.session.user.id });
  req.session.flash = { type: 'success', message: 'Your job posting is now live.' };
  res.redirect('/dashboard');
}
export function showUpdateJobPage(req, res) {
  const job = getJobById(req.params.id);
  if (!job) return res.status(404).render('error', { title: 'Job not found', status: 404, message: 'This job may have been removed.' });
  if (job.recruiterId !== req.session.user.id) return res.status(403).render('error', { title: 'Access denied', status: 403, message: 'You can only edit your own job postings.' });
  res.render('jobForm', { title: 'Edit job', heading: 'Edit job posting', action: `/jobs/${job.id}/edit`, job, error: null });
}
export function updateJobPost(req, res) {
  const data = cleanJobInput(req.body);
  const error = validateJob(data);
  const existing = getJobById(req.params.id);
  if (!existing) return res.status(404).render('error', { title: 'Job not found', status: 404, message: 'This job may have been removed.' });
  if (existing.recruiterId !== req.session.user.id) return res.status(403).render('error', { title: 'Access denied', status: 403, message: 'You can only edit your own job postings.' });
  if (error) return res.status(400).render('jobForm', { title: 'Edit job', heading: 'Edit job posting', action: `/jobs/${existing.id}/edit`, job: { ...existing, ...data }, error });
  updateJob(req.params.id, data, req.session.user.id);
  req.session.flash = { type: 'success', message: 'Job posting updated.' };
  res.redirect('/dashboard');
}
export function deleteJobPost(req, res) {
  const deleted = deleteJob(req.params.id, req.session.user.id);
  if (!deleted) return res.status(404).render('error', { title: 'Job not found', status: 404, message: 'Job not found or you do not own it.' });
  req.session.flash = { type: 'success', message: 'Job posting deleted.' };
  res.redirect('/dashboard');
}
function cleanJobInput(body) {
  return { title: String(body.title || '').trim(), company: String(body.company || '').trim(), location: String(body.location || '').trim(), employmentType: String(body.employmentType || 'Full-time').trim(), salary: String(body.salary || 'Not specified').trim(), description: String(body.description || '').trim(), skills: String(body.skills || '').trim() };
}
function validateJob(job) {
  if (!job.title || !job.company || !job.location || !job.description) return 'Please complete all required fields.';
  if (job.title.length > 120 || job.company.length > 120 || job.description.length > 5000) return 'Some fields exceed the allowed length.';
  return null;
}
