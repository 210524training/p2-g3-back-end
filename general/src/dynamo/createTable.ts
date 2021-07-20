import * as AWS from 'aws-sdk';
import TableName from './consts';

AWS.config.update({ region: 'us-east-1' });

const ddb = new AWS.DynamoDB({ apiVersion: 'latest' });

const params: AWS.DynamoDB.CreateTableInput = {
  KeySchema: [
    {
      AttributeName: 'entity',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'id',
      KeyType: 'RANGE',
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: 'entity',
      AttributeType: 'S',
    },
    {
      AttributeName: 'id',
      AttributeType: 'S',
    },
  ],
  TableName,
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
  StreamSpecification: {
    StreamEnabled: false,
  },
  // LocalSecondaryIndexes: [
  //   {
  //     IndexName: 'user-username-index',
  //     KeySchema: [
  //       {
  //         AttributeName: 'entity',
  //         KeyType: 'HASH',
  //       },
  //       {
  //         AttributeName: 'username',
  //         KeyType: 'RANGE',
  //       },
  //     ],
  //     Projection: {
  //       ProjectionType: 'KEYS_ONLY',
  //     },
  //   },
  // ],
};

export default async function createTable() {
  try {
    const response = await ddb.createTable(params).promise();
    console.log(response);
  } catch (error) {
    console.log('Failed to create table: ', error);
  }
}
