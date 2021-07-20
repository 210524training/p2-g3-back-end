import { ChatRoom } from 'src/@types/index.d';
import TableName from '../../dynamo/consts';
import Repository from './repository';

export class ChatRoomRepository extends Repository<ChatRoom> {
  constructor() {
    super(
      TableName,
      'ChatRoom',
      'id, title, username, messages, lastMessage',
    );
  }
}

export default new ChatRoomRepository();
