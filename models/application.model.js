const applications = [];
let nextApplicationId = 1;

export function createApplication(data) {
  const duplicate = applications.find(item => item.jobId === String(data.jobId) && item.applicantId === String(data.applicantId));
  if (duplicate) return { ok: false, message: 'You have already applied for this job.' };
  const application = {
    id: String(nextApplicationId++), jobId: String(data.jobId), applicantId: String(data.applicantId),
    applicantName: data.applicantName, applicantEmail: data.applicantEmail,
    resumeFilename: data.resumeFilename, status: 'Pending', appliedAt: new Date()
  };
  applications.push(application);
  return { ok: true, application };
}
export function getApplicationsByApplicant(applicantId) {
  return applications.filter(item => item.applicantId === String(applicantId)).sort((a,b) => b.appliedAt-a.appliedAt);
}
export function getApplicationsByJob(jobId) {
  return applications.filter(item => item.jobId === String(jobId)).sort((a,b) => b.appliedAt-a.appliedAt);
}
export function getApplicationById(id) { return applications.find(item => item.id === String(id)) || null; }
export function updateApplicationStatus(id, status) {
  const application = getApplicationById(id);
  if (!application) return null;
  application.status = status;
  return application;
}
