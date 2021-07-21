import { Forum } from 'src/@types/index.d';
import Repository from './repository';

export class ForumRepository extends Repository<Forum> {
  constructor() {
    super(
      process.env.TABLE_NAME,
      'Forum',
      'id, title, tags, username, createdAt, content, likes, numberOfComments, comments',
    );
  }
}

export default new ForumRepository();
