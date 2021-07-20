import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/forurm-repository';

const getAllForums: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  const forums = await repository.getAll();
  return (
    formatJSONResponse({
      forums,
    })
  );
};

export const main = middyfy(getAllForums);
