import { User } from 'src/@types/index.d';
import Repository from './repository';

export class UserRepository extends Repository<User> {
  constructor() {
    super(
      process.env.TABLE_NAME,
      'User',
      'id, contacts, chatRoomIds',
    );
  }
}

export default new UserRepository();
