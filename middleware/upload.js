import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const allowed = new Set(['.pdf', '.doc', '.docx']);
function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMime = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowed.has(ext) || !allowedMime.includes(file.mimetype)) return cb(new Error('Please upload a PDF, DOC, or DOCX resume only.'));
  cb(null, true);
}
export const uploadResume = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
export { uploadDir };
