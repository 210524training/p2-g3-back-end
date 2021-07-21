import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/chat-room-repository';

const getChatRoomById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const { id } = event.path;

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
