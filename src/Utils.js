const getUrlFromBucket = (s3Bucket,fileName) => {
  const {config :{params,region}} = s3Bucket;
  const regionString = region.includes('us-east-1') ?'':('-' + region)
  return `https://${params.Bucket}.s3${regionString}.amazonaws.com/${fileName}`
};

const getFileName = (url) => {
  const filenameWithExtension = url.substring(url.lastIndexOf('/')+1);
  return filenameWithExtension.substr(0, filenameWithExtension.lastIndexOf("."));
}

const Utils = {
  getUrlFromBucket,
  getFileName
}

export default Utils;
