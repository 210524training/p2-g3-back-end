import log from '../log';
import Reimbursement from '../models/reimbursement';
import reimbursementRepository, { ReimbursementRepository } from '../repositories/reimbursement.repository';
import Service from './generic/service';

export class ReimbursementService extends Service<Reimbursement, ReimbursementRepository> {
  constructor() {
    super(reimbursementRepository);
  }

  updateIfNeeded(reimbursements: Reimbursement[]): void {
    reimbursements.filter((o) => o.toUpdate).forEach(async (u) => {
      // I intend to mutate the to update property in the Reimbursement object.
      // eslint-disable-next-line no-param-reassign
      u.setToUpdate = false;
      const updated = await this.update(u);
      log.debug(
        updated ? 'Updated' : 'Failed to update',
        'reimbursement:', u.id,
      );
    });
  }

  async getAllAndUpdate(): Promise<Reimbursement[]> {
    // this.updateIfNeeded(await this.getAll());
    return this.getAll();
  }

  async getNotApprovedNorRejected(): Promise<Reimbursement[]> {
    // this.updateIfNeeded(await this.repository.getNotApprovedNorRejected());
    return this.repository.getNotApprovedNorRejected();
  }

  async getAllByEmployeeId(employeeId: string): Promise<Reimbursement[]> {
    // this.updateIfNeeded(await this.repository.getAllByEmployeeId(employeeId));
    return this.repository.getAllByEmployeeId(employeeId);
  }
}

export default new ReimbursementService();
