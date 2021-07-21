import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'forums/{id}',
        integration: 'lambda',
        cors: true,
      },
    },
  ],
};
