import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../../dynamo';
import log from '../../log';
import { IEntity } from '../../@types/trms/index.d';

/**
 * Generic repository that implements the basic CRUD operations (also getting all items
 * or an item by id).
 *
 * @author Dustin Díaz
 */
export default class Repository<T extends IEntity> {
  /**
   * Avoid using dynamodb keywords.
   *
   * Recomendation: Please provide a cast implementation.
   *
   * Note: DO NOT USE DYNAMODB KEYWORD.
   * @param TableName The name of the table (database) containing the requested items.
   * @param EntityName The name of the entity in the table.
   * @param ProjectionExpression A string that identifies one or more attributes
   *                             to retrieve from the table.
   * @param cast A function that casts the returned item from the table to the
   *             appropriate type (i.e., using the type's contructor). `item as <T>` might
   *             not work in all cases.
   * @param client DynamoDB document client.
   */
  constructor(
    protected TableName: string,
    protected EntityName: string,
    protected ProjectionExpression: string,
    protected cast: (item: DocumentClient.AttributeMap | T) => T = (item) => item as T,
    protected client: DocumentClient = dynamo,
  ) {}

  async getAll(): Promise<T[]> {
    const params: DocumentClient.QueryInput = {
      TableName: this.TableName,
      KeyConditionExpression: 'entity = :e',
      ExpressionAttributeValues: {
        ':e': this.EntityName,
      },
      ProjectionExpression: this.ProjectionExpression,
    };

    const data = await this.client.query(params).promise();
    return data.Items ? this.castArray(data.Items) : [];
  }

  async getById(id: string): Promise<T | null> {
    const params: DocumentClient.GetItemInput = {
      TableName: this.TableName,
      Key: {
        entity: this.EntityName,
        id,
      },
      ProjectionExpression: this.ProjectionExpression,
    };

    const data = await this.client.get(params).promise();
    if (!data.Item) {
      log.debug(`Couldn't find item in ${this.TableName}::${this.EntityName}`, data);
      return null;
    }
    return this.cast(data.Item);
  }

  async add(item: T): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {
      TableName: this.TableName,
      Item: {
        ...item,
        entity: this.EntityName,
      },
      ConditionExpression: 'id <> :id',
      ExpressionAttributeValues: {
        ':id': item.id,
      },
    };
    try {
      await this.client.put(params).promise();
      return true;
    } catch (error) {
      log.error(`Failed to add ${this.TableName}::${this.EntityName}:`, error);
      return false;
    }
  }

  async update(item: T): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {
      TableName: this.TableName,
      Item: {
        ...item,
        entity: this.EntityName,
      },
      ConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': item.id,
      },
    };

    try {
      await this.client.put(params).promise();
      return true;
    } catch (error) {
      log.error(`Failed to update ${this.TableName}::${this.EntityName}:`, error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    const params: DocumentClient.DeleteItemInput = {
      TableName: this.TableName,
      Key: {
        entity: this.EntityName,
        id,
      },
    };

    try {
      await this.client.delete(params).promise();
      return true;
    } catch (error) {
      log.error(`Failed to delete ${this.TableName}::${this.EntityName}:`, error);
      return false;
    }
  }

  protected castArray(items: DocumentClient.ItemList): T[] {
    return items.map((item) => this.cast(item));
  }
}
