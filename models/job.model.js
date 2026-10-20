const jobs = [];
let nextJobId = 1;

export function createJob(data) {
  const job = {
    id: String(nextJobId++), title: data.title.trim(), company: data.company.trim(),
    location: data.location.trim(), employmentType: (data.employmentType || 'Full-time').trim(),
    salary: (data.salary || 'Not specified').trim(), description: data.description.trim(),
    skills: (data.skills || '').trim(), recruiterId: String(data.recruiterId),
    createdAt: new Date(), updatedAt: new Date()
  };
  jobs.unshift(job);
  return job;
}

export function getAllJobs({ query = '', page = 1, limit = 6 } = {}) {
  const q = String(query).trim().toLowerCase();
  const filtered = jobs.filter(job => !q || [job.title, job.company, job.location, job.skills, job.description]
    .some(value => String(value || '').toLowerCase().includes(q)));
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (safePage - 1) * limit;
  return { jobs: filtered.slice(start, start + limit), total, page: safePage, totalPages, query: String(query) };
}

export function getJobById(id) { return jobs.find(job => job.id === String(id)) || null; }
export function getJobsByRecruiter(recruiterId) { return jobs.filter(job => job.recruiterId === String(recruiterId)); }
export function updateJob(id, data, recruiterId) {
  const job = jobs.find(item => item.id === String(id) && item.recruiterId === String(recruiterId));
  if (!job) return null;
  for (const key of ['title', 'company', 'location', 'employmentType', 'salary', 'description', 'skills']) {
    if (data[key] !== undefined) job[key] = String(data[key]).trim();
  }
  job.updatedAt = new Date();
  return job;
}
export function deleteJob(id, recruiterId) {
  const index = jobs.findIndex(item => item.id === String(id) && item.recruiterId === String(recruiterId));
  if (index < 0) return false;
  jobs.splice(index, 1);
  return true;
}
