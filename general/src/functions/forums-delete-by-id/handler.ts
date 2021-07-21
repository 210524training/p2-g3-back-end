import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/forurm-repository';

const getForumById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const { id } = event.pathParameters;

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
