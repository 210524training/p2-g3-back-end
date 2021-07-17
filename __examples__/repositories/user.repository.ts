import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../log';
import User from '../models/user';
import Repository from './generic/repository';
import { TableName, UserEntityName } from '../dynamo/consts';

export class UserRepository extends Repository<User> {
  constructor() {
    super(
      TableName,
      UserEntityName,
      'id, username, password, employeeRoles, email, firstName, lastName, address, phoneNumber, consumedAt',
      (o) => new User(
        o.username,
        o.password,
        o.employeeRoles,
        o.email,
        o.firstName,
        o.lastName,
        o.address,
        o.phoneNumber,
        o.consumedAt,
        o.id,
      ),
    );
  }

  async getByUsername(username: string): Promise<User | null> {
    const params: DocumentClient.QueryInput = {
      TableName: this.TableName,
      IndexName: 'user-username-index',
      KeyConditionExpression: 'entity = :c AND username = :u',
      ExpressionAttributeValues: {
        ':c': this.EntityName,
        ':u': username,
      },
      ProjectionExpression: this.ProjectionExpression,
    };

    const data = await this.client.query(params).promise();

    if (!data.Items || data.Count === 0) {
      log.debug(`No user with username '${username}' was found.`);
      return null;
    }

    return this.cast(data.Items[0]);
  }
}

export default new UserRepository();
