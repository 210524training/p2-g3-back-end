import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import sendMessage from '@functions/sendMessage';
import disconnect from '@functions/disconnect';
import connect from '@functions/connect';

const serverlessConfiguration: AWS = {
  service: 'aws-nodejs-typescript',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceExclude: [
          "aws-sdk"
        ],
      },
      excludeFiles: [
        '**/*.test.ts',
      ],
    },
  },
  plugins: ['serverless-webpack', 'serverless-websockets-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    websocketsApiName: 'custom-websockets-api-name',
    websocketsApiRouteSelectionExpression: '$request.body.action',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { 
    hello,
    connectionHandler: {
      handler: 'handler.connectionHandler',
      events: [
        {
          websocket: {
            route: '$connect',
          }
        }
      ],

    },
  },
};

module.exports = serverlessConfiguration;
