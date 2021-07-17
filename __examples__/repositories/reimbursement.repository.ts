import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../log';
import Reimbursement from '../models/reimbursement';
import { Status as StatusType } from '../@types/trms/index.d';
import Repository from './generic/repository';
import { TableName, ReimbursementEntityName } from '../dynamo/consts';

export class ReimbursementRepository extends Repository<Reimbursement> {
  constructor() {
    super(
      TableName,
      ReimbursementEntityName,
      'id, employeeId, title, eventType, gradingFormatId, startDate, endDate, locationOfEvent, descriptionOfEvent, costs, grade, workRelatedJustification, completed, amountPaid, attachments, workTimeMissed, reimbusementStatus, adminComments, createdAt, updatedAt, startedApprovalProcess, approvals, sentEmail',
      (o) => new Reimbursement(
        o.employeeId,
        o.title,
        o.eventType,
        o.gradingFormatId,
        o.startDate,
        o.endDate,
        o.locationOfEvent,
        o.descriptionOfEvent,
        o.costs,
        o.grade,
        o.workRelatedJustification,
        o.completed,
        o.amountPaid,
        o.attachments,
        o.workTimeMissed,
        o.reimbusementStatus,
        o.adminComments,
        o.id,
        o.createdAt,
        o.updatedAt,
        o.startedApprovalProcess,
        o.approvals,
        o.sentEmail,
      ),
    );
  }

  async getNotApprovedNorRejected(): Promise<Reimbursement[]> {
    const accepted: StatusType = 'Approved';
    const rejected: StatusType = 'Rejected';
    const params: DocumentClient.QueryInput = {
      TableName: this.TableName,
      // I know shh
      KeyConditionExpression: 'entity = :e',
      FilterExpression: 'reimbusementStatus <> :acc AND reimbusementStatus <> :rej',
      ExpressionAttributeValues: {
        ':e': this.EntityName,
        ':acc': accepted,
        ':rej': rejected,
      },
      ProjectionExpression: this.ProjectionExpression,
    };

    const data = await this.client.query(params).promise();

    if (!data.Items || data.Items.length === 0) {
      log.debug('Could not find any reimbursements that are pending (any status that is not aither apporved or denied)');
      return [];
    }

    return this.castArray(data.Items);
  }

  async getAllByEmployeeId(employeeId: string): Promise<Reimbursement[]> {
    const params: DocumentClient.ScanInput = {
      TableName: this.TableName,
      FilterExpression: 'entity = :e AND employeeId = :em',
      ExpressionAttributeValues: {
        ':e': 'Reimbursement',
        ':em': employeeId,
      },
      ProjectionExpression: this.ProjectionExpression,
    };

    const data = await this.client.scan(params).promise();

    if (!data.Items || data.Items.length === 0) {
      log.debug(`User with id ${employeeId} has not requested any reimbursements.`);
      return [];
    }

    log.debug(data.Items);
    return this.castArray(data.Items);
  }

  // async update(item: Reimbursement): Promise<boolean> {
  //   // delete item.attachments;
  //   const params: DocumentClient.PutItemInput = {
  //     TableName: this.TableName,
  //     Item: {
  //       ...item,
  //       entity: this.EntityName,
  //     },
  //     ConditionExpression: 'id = :id',
  //     ExpressionAttributeValues: {
  //       ':id': item.id,
  //     },
  //   };

  //   try {
  //     await this.client.put(params).promise();
  //     return true;
  //   } catch (error) {
  //     log.error(`Failed to update ${this.TableName}::${this.EntityName}:`, error);
  //     return false;
  //   }
  // }
}

export default new ReimbursementRepository();
