import OSS from 'ali-oss';
import constants from '../constants';

const client = new OSS({
  region: constants.OSS_REGION,
  accessKeyId: constants.OSS_ACCESS_KEY_ID,
  accessKeySecret: constants.OSS_ACCESS_KEY_SECRET,
  bucket: constants.OSS_BUCKET,
});

export default client;
