import * as AWS from 'aws-sdk';
import TableName from './consts';

AWS.config.update({ region: 'us-east-1' });

const ddb = new AWS.DynamoDB({ apiVersion: 'latest' });

export default async function deleteTable() {
  try {
    const response = await ddb.deleteTable({ TableName }).promise();
    console.log(response);
  } catch (error) {
    console.log('Failed to delete table: ', error);
  }
}
