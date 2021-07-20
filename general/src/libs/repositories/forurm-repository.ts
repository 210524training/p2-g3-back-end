import { Forum } from 'src/@types/index.d';
import TableName from '../../dynamo/consts';
import Repository from './repository';

export class ForumRepository extends Repository<Forum> {
  constructor() {
    super(
      TableName,
      'Forum',
      'id, title, tags, username, createdAt, content, likes, numberOfComments, comments',
    );
  }
}

export default new ForumRepository();
