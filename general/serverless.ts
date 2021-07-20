/* eslint-disable quote-props */
import type { AWS } from '@serverless/typescript';
import hello from '@functions/hello';

import forumsGetAll from '@functions/forums-get-all';
import forumGetById from '@functions/forums-get-by-id';
import forumDeleteById from '@functions/forums-delete-by-id';
import forumUpdate from '@functions/forums-update';
import forumCreate from '@functions/forums-create';

import TableName from './src/dynamo/consts';
// import deleteTable from './src/dynamo/deleteTable';
// import createTable from './src/dynamo/createTable';

// const sleep = (ms: number) => new Promise((resolve) => {
//   console.log(`Sleeping ${ms / 1000} seconds...`);
//   setTimeout(resolve, ms);
// });

// (async () => {
//   await deleteTable();
//   await sleep(10 * 1000);
//   await createTable();
//   await sleep(10 * 1000);
// })();

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
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      TABLE_NAME: TableName,
    },
    lambdaHashingVersion: '20201221',
  },

  functions: {
    hello,
    forumsGetAll,
    forumGetById,
    forumDeleteById,
    forumUpdate,
    forumCreate,
  },
};

module.exports = serverlessConfiguration;
