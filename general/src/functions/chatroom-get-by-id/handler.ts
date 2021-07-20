import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/chat-room-repository';
import schema from './schema';

const getChatRoomById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let { id } = event.body;
  if (!id && event.pathParameters) {
    id = event.pathParameters.id;
  }
  if (id) {
    const chatRoom = await repository.getById(id);
    return (
      formatJSONResponse({
        chatRoom,
      })
    );
  }

  return (
    formatJSONResponse({
      chatRoom: null,
    })
  );
};

export const main = middyfy(getChatRoomById);
