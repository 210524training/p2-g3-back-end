import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { TableName } from '../consts';

dotenv.config({});

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
    {
      AttributeName: 'username',
      AttributeType: 'S',
    },
    {
      AttributeName: 'grade-format',
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
  LocalSecondaryIndexes: [
    {
      IndexName: 'user-username-index',
      KeySchema: [
        {
          AttributeName: 'entity',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'username',
          KeyType: 'RANGE',
        },
      ],
      Projection: {
        ProjectionType: 'KEYS_ONLY',
      },
    },
    {
      IndexName: 'grade-format-index',
      KeySchema: [
        {
          AttributeName: 'entity',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'grade-format',
          KeyType: 'RANGE',
        },
      ],
      Projection: {
        ProjectionType: 'KEYS_ONLY',
      },
    },
  ],
};

(async () => {
  try {
    const response = await ddb.createTable(params).promise();

    console.log(response);
  } catch (error) {
    console.log('Failed to create table: ', error);
  }
})();
