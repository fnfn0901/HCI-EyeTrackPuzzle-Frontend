require('dotenv').config();

const express = require('express');
const AWS = require('aws-sdk');

const app = express();

// AWS 설정
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.BUCKET_NAME;
const IMAGE_FOLDER = 'images/puzzles/';

app.get('/api/images', async (req, res) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Prefix: IMAGE_FOLDER,
        };

        const data = await s3.listObjectsV2(params).promise();
        const imageFiles = data.Contents.filter(item => {
            const ext = item.Key.split('.').pop().toLowerCase();
            return ['png', 'jpg', 'jpeg', 'gif'].includes(ext);
        }).map(item => `https://${BUCKET_NAME}.s3.${AWS.config.region}.amazonaws.com/${item.Key}`);

        res.json(imageFiles);
    } catch (err) {
        console.error('이미지 목록 가져오기 실패:', err);
        res.status(500).json({ error: '이미지 목록을 가져오지 못했습니다.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});