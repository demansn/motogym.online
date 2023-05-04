import {Storage} from '@google-cloud/storage';
import path from 'path';

const gc = new Storage({
    keyFilename: path.join(__dirname, '../config/storage.json'),
    projectId: 'motogym-online'
});

const BASE_URL = 'https://storage.googleapis.com/motogym-online-files';

export async function addFile(file, folder, fileName) {
    const { createReadStream, filename } = await file;
    const {ext, name} = path.parse(filename);

    if (!fileName) {
        fileName = name;
    }

    const newFileName = `${folder}/${fileName}${ext}`;
    const options = {
        resumable: false,
        gzip: true
    };

    await new Promise((res, rej) =>
        createReadStream()
            .pipe(
                googleStorage.file(newFileName).createWriteStream(options)
            )
            .on("finish", res)
            .on('error', rej)
    );

    return `${folder}/${fileName}${ext}`;
}

export async function removeFile(fileName) {
    const file = googleStorage.file(fileName);

    try {
        await file.delete();
    } catch (e) {
        console.error(e);
    }
}

export const bucket = gc.bucket(process.env.BUCKET_NAME)
