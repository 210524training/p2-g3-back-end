import 'source-map-support/register';

import { Forum } from 'src/@types/index.d';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/forurm-repository';
import schema from './schema';

const createForum: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const forum: Forum = event?.body;
  if (forum) {
    return (
      formatJSONResponse({
        created: await repository.add(forum),
      })
    );
  }

  return (
    formatJSONResponse({
      created: false,
    })
  );
};

export const main = middyfy(createForum);
