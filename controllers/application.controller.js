import { createApplication, getApplicationsByApplicant, getApplicationsByJob, getApplicationById, updateApplicationStatus } from '../models/application.model.js';
import { getJobById } from '../models/job.model.js';
import { sendApplicationConfirmation } from '../services/email.service.js';

export function showApplyPage(req, res) {
  const job = getJobById(req.params.id);
  if (!job) return res.status(404).render('error', { title: 'Job not found', status: 404, message: 'This job may have been removed.' });
  res.render('apply', { title: 'Apply for job', job, error: null });
}
export async function submitApplication(req, res, next) {
  try {
    const job = getJobById(req.params.id);
    if (!job) return res.status(404).render('error', { title: 'Job not found', status: 404, message: 'This job may have been removed.' });
    if (!req.file) return res.status(400).render('apply', { title: 'Apply for job', job, error: 'Please attach your resume (PDF, DOC, or DOCX, maximum 5 MB).' });
    const result = createApplication({ jobId: job.id, applicantId: req.session.user.id, applicantName: req.session.user.name, applicantEmail: req.session.user.email, resumeFilename: req.file.filename });
    if (!result.ok) return res.status(409).render('apply', { title: 'Apply for job', job, error: result.message });
    let emailSent = false;
    try { emailSent = (await sendApplicationConfirmation({ to: req.session.user.email, applicantName: req.session.user.name, jobTitle: job.title, company: job.company })).sent; }
    catch (mailError) { console.error('Confirmation email could not be sent:', mailError.message); }
    req.session.flash = { type: 'success', message: emailSent ? 'Application submitted! A confirmation email has been sent.' : 'Application submitted successfully. Email confirmation is not configured on this local setup.' };
    res.redirect('/my-applications');
  } catch (err) { next(err); }
}
export function showMyApplications(req, res) {
  const applications = getApplicationsByApplicant(req.session.user.id).map(application => ({ ...application, job: getJobById(application.jobId) }));
  res.render('myApplications', { title: 'My applications', applications });
}
export function showApplicants(req, res) {
  const job = getJobById(req.params.id);
  if (!job) return res.status(404).render('error', { title: 'Job not found', status: 404, message: 'This job may have been removed.' });
  if (job.recruiterId !== req.session.user.id) return res.status(403).render('error', { title: 'Access denied', status: 403, message: 'You can only view applications for your own jobs.' });
  res.render('applicants', { title: 'Applicants', job, applications: getApplicationsByJob(job.id) });
}
export function changeApplicationStatus(req, res) {
  const job = getJobById(req.params.jobId);
  const validStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'];
  if (!job) return res.status(404).render('error', { title: 'Job not found', status: 404, message: 'This job may have been removed.' });
  if (job.recruiterId !== req.session.user.id) return res.status(403).render('error', { title: 'Access denied', status: 403, message: 'You can only update applications for your own jobs.' });
  if (!validStatuses.includes(req.body.status)) return res.status(400).redirect(`/jobs/${job.id}/applicants`);
  const application = getApplicationsByJob(job.id).find(item => item.id === String(req.params.applicationId));
  if (!application) return res.status(404).render('error', { title: 'Application not found', status: 404, message: 'This application could not be found.' });
  updateApplicationStatus(application.id, req.body.status);
  req.session.flash = { type: 'success', message: 'Application status updated.' };
  res.redirect(`/jobs/${job.id}/applicants`);
}


import path from 'node:path';
import fs from 'node:fs';
import { uploadDir } from '../middleware/upload.js';
export function downloadResume(req, res) {
  const application = getApplicationForDownload(req.params.applicationId);
  if (!application) return res.status(404).render('error', { title: 'Resume not found', status: 404, message: 'This resume is no longer available.' });
  const job = getJobById(application.jobId);
  if (!job || job.recruiterId !== req.session.user.id) return res.status(403).render('error', { title: 'Access denied', status: 403, message: 'You can only download resumes for your own job postings.' });
  const filename = path.basename(application.resumeFilename);
  const filepath = path.join(uploadDir, filename);
  if (!fs.existsSync(filepath)) return res.status(404).render('error', { title: 'Resume not found', status: 404, message: 'The resume file could not be found.' });
  res.download(filepath, filename);
}
function getApplicationForDownload(id) {
  // Search applications for a matching identifier across jobs already in memory.
  // Importing the model getter keeps the route from exposing files publicly.
  return getApplicationById(id);
}
