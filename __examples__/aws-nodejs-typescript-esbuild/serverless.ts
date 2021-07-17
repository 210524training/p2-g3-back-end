import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'training-210524-lambda-template',
  frameworkVersion: '2',
  custom: {
    // webpack: {
    //   webpackConfig: './webpack.config.js',
    //   includeModules: {
    //     forceExclude: [
    //       'aws-sdk',
    //     ],
    //   },
    // },
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      external: [
        'aws-sdk'
      ],
      watch: {
        pattern: ['src/**/*'],
        ignore: ['.serverless/**/*', '.build', 'node_modules', '.esbuild']
      }
    }
  },
  plugins: ['serverless-esbuild', 'serverless-plugin-resource-tagging'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'sls',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    stackTags: {
      'Created By': 'Matthew Oberlies',
      'Delete After': '08/13/21',
      'Contact Before Delete': 'matthew.oberlies@revature.com',
      'Purpose': '210524 Serverless Example'
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { hello },
};

module.exports = serverlessConfiguration;
