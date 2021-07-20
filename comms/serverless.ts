/* eslint-disable quote-props */
import type { AWS } from '@serverless/typescript';

import connect from '@functions/connect';
import disconnect from '@functions/disconnect';
import def from '@functions/default';
import sendmessage from '@functions/sendmessage';

const tableName = 'p2g3-chatapredu-table';

const serverlessConfiguration: AWS = {
  service: 'p2g3-chatapredu-comms-serverless',
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
    apiGateway: {
      binaryMediaTypes: [
        'multipart/form-data',
      ],
    },

    stackTags: {
      'Created By': 'Dustin Diaz',
      'Delete After': '08/13/21',
      'Contact Before Delete': 'hi.dustin.diaz@gmail.com',
      'Purpose': 'backend comm for p2',
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      TABLE_NAME: tableName,
    },
    lambdaHashingVersion: '20201221',
  },

  functions: {
    def,
    connect,
    disconnect,
    sendmessage,
  },
};

module.exports = serverlessConfiguration;
