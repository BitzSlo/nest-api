import { extname } from 'path';
export function MediaFileName(req, file, callback) {
  callback(null, `${Date.now()}${extname(file.originalname)}`);
}
