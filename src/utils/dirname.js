import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pakaiSemua = path.join(__dirname, '../../src/public');
const bukaFile = (res, namaFile,tempatFile) => {
    return res.sendFile(namaFile, { root: path.join(__dirname, tempatFile) });
}
export {__dirname, pakaiSemua, bukaFile};