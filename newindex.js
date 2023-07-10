const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
 
const s3Client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: 'AKIARE25Y7B5A7YDPQSV',
  secretAccessKey: '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'
  }
});

async function downloadAndUpload(link, bucketName, folderName) {
  try {
   
    const fileName = path.basename(link);

    const response = await axios({
      url: link,
      method: 'GET',
      responseType: 'stream'
    });

    const tempFilePath = path.join(__dirname, fileName);
    const tempFile = fs.createWriteStream(tempFilePath);

    response.data.pipe(tempFile);

    await new Promise((resolve, reject) => {
      tempFile.on('finish', resolve);
      tempFile.on('error', reject);
    });

    const fileContent = fs.readFileSync(tempFilePath);

    const uploadParams = {
      Bucket: bucketName,
      Key: `${folderName}/${fileName}`,
      Body: fileContent
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    console.log(`File uploaded successfully to S3: ${uploadParams.Key}`);

    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error('Error:', error);
  }
}

const link = 'https://imgd.aeplcdn.com/0x0/n/cw/ec/14054/huracan-evo-exterior-right-front-three-quarter-2.jpeg'; // Replace with your image/video link
const bucketName = 'downloaderinsta';
const folderName = 'images'; //folder name in S3 bucket

downloadAndUpload(link, bucketName, folderName);