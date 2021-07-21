/* eslint-disable quote-props */
import type { AWS } from '@serverless/typescript';
import hello from '@functions/hello';

import forumCreate from '@functions/forums-create';
import forumsGetAll from '@functions/forums-get-all';
import forumGetById from '@functions/forums-get-by-id';
import forumUpdate from '@functions/forums-update';
import forumDeleteById from '@functions/forums-delete-by-id';

import chatRoomCreate from '@functions/chatroom-create';
import chatRoomGetAll from '@functions/chatroom-get-all';
import chatRoomGetById from '@functions/chatroom-get-by-id';
import chatRoomUpdate from '@functions/chatroom-update';
import chatRoomDelete from '@functions/chatroom-delete-by-id';

import TableName from './src/dynamo/consts';

const serverlessConfiguration: AWS = {
  service: 'p2g3-chatapredu-backend',
  frameworkVersion: '2',
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      external: [
        'aws-sdk',
      ],
      watch: {
        pattern: ['src/**/*'],
        ignore: ['.serverless/**/*', '.build', 'node_modules', '.esbuild'],
      },
    },
  },
  plugins: ['serverless-esbuild', 'serverless-plugin-resource-tagging'],
  provider: {
    name: 'aws',
    region: 'us-east-1',
    runtime: 'nodejs14.x',
    profile: 'sls',
    stackTags: {
      'Created By': 'Dustin Diaz',
      'Delete After': '08/13/21',
      'Contact Before Delete': 'hi.dustin.diaz@gmail.com',
      'Purpose': 'backend for p2',
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      TABLE_NAME: TableName,
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        name: 'lambda-dynamodb-chat-db-access',
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'ec2:CreateNetworkInterface',
              'ec2:DescribeNetworkInterfaces',
              'ec2:DeleteNetworkInterface',
            ],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
            Resource: [
              {
                'Fn::Join': [
                  ':',
                  [
                    'arn:aws:dynamodb',
                    {
                      Ref: 'AWS::Region',
                    },
                    {
                      Ref: 'AWS::AccountId',
                    },
                    `table/${TableName}`,
                  ],
                ],
              },
            ],
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:Scan',
            ],
            Resource: [
              {
                'Fn::Join': [
                  ':',
                  [
                    'arn:aws:dynamodb',
                    {
                      Ref: 'AWS::Region',
                    },
                    {
                      Ref: 'AWS::AccountId',
                    },
                    `table/${TableName}/index/*`,
                  ],
                ],
              },
            ],
          },
        ],
      },
    },
  },

  functions: {
    hello,
    forumsGetAll,
    forumGetById,
    forumDeleteById,
    forumUpdate,
    forumCreate,
    chatRoomCreate,
    chatRoomGetAll,
    chatRoomGetById,
    chatRoomUpdate,
    chatRoomDelete,
  },

  resources: {
    Resources: {
      p2g3chatapredu: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName,
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
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
