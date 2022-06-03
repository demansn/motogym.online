const S3 = require("aws-sdk/clients/s3");
const path = require("path");
const AWS_BUCKET_NAME='motogym-files';
const AWS_BUCKET_REGION='eu-west-2';
const AWS_ARN='arn:aws:s3:::motogym-files/*';
const AWS_ACCESS_KEY_ID='AKIAUTNYMW6Z7YSCXQE5';
const AWS_SECRET_ACCESS_KEY='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';
const BASE_URL = 'https://motogym-files.s3.eu-west-2.amazonaws.com';


const s3 = new S3({
    region: AWS_BUCKET_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

async function addFile(file, folder, fileName) {
    const { createReadStream, filename} = await file;
    const {ext, name} = path.parse(filename);

    if (!fileName) {
        fileName = name;
    }

    const newFileName = `${folder}/${fileName}${ext}`;
    const fileStream = createReadStream();
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Body: fileStream,
        Key: newFileName,
    };

    return s3.upload(uploadParams).promise().then( ({Location}) => Location);
}

async function removeFile(fileName) {
    fileName = fileName.replace(`${BASE_URL}/`, '');

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
    };

    return s3.deleteObject(params).promise();
}

module.exports = {
    addFile,
    removeFile
};