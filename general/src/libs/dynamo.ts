import * as AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: `https://dynamodb.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`,
  apiVersion: 'latest',
});

export default dynamo;
