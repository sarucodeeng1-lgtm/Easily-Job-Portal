import nodemailer from 'nodemailer';

export async function sendApplicationConfirmation({ to, applicantName, jobTitle, company }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    return { sent: false, reason: 'SMTP is not configured' };
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject: `Application received: ${jobTitle}`,
    text: `Hello ${applicantName},\n\nYour application for ${jobTitle} at ${company} has been received successfully.\n\nThank you for using Easily.`,
    html: `<p>Hello ${escapeHtml(applicantName)},</p><p>Your application for <strong>${escapeHtml(jobTitle)}</strong> at ${escapeHtml(company)} has been received successfully.</p><p>Thank you for using Easily.</p>`
  });
  return { sent: true };
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
