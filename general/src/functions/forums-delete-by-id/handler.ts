import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/forurm-repository';
import schema from './schema';

const getForumById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let { id } = event.body;
  if (!id && event.pathParameters) {
    id = event.pathParameters.id;
  }
  if (id) {
    const forum = await repository.delete(id);
    return (
      formatJSONResponse({
        forum,
      })
    );
  }

  return (
    formatJSONResponse({
      forum: null,
    })
  );
};

export const main = middyfy(getForumById);
