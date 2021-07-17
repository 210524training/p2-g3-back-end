import { NoUserMatchesUsernameError, PasswordNotMatchesError } from '../errors';
import log from '../log';
import Reimbursement from '../models/reimbursement';
import User from '../models/user';
import userRepository, { UserRepository } from '../repositories/user.repository';
import Mail from '../utils/mail';
import Service from './generic/service';

const sleep = (ms: number) => new Promise((resolve) => {
  log.debug(`Sleeping ${ms / 1000} seconds...`);
  setTimeout(resolve, ms);
});
export class UserService extends Service<User, UserRepository> {
  constructor() {
    super(userRepository);
  }

  async isSuper(id: string): Promise<boolean> {
    const user = await this.getById(id);
    return user ? user.isSuperUser() : false;
  }

  getByUsername(username: string): Promise<User | null> {
    return this.repository.getByUsername(username);
  }

  async login(username: string, password: string): Promise<User> {
    const user = await this.repository.getByUsername(username);

    if (!user) {
      throw new NoUserMatchesUsernameError();
    }

    if (user.password !== password) {
      throw new PasswordNotMatchesError();
    }

    return user;
  }

  register(user: User): Promise<boolean> {
    return this.add(user);
  }

  async sendMailToDirectorSupervisors(reimbursement: Reimbursement): Promise<boolean> {
    const employee = await this.getById(reimbursement.employeeId);
    if (employee) {
      const directorSupervisors = (await this.getAll()).filter((emp) => emp.employeeRoles.includes('Director Supervisor'));

      if (directorSupervisors.length > 0) {
        const url = `${(process.env.WEB_CLIENT_ORIGIN || 'http://localhost:4000')}/reimbursements`;
        directorSupervisors.forEach(async (su) => {
          if (su.email) {
            log.debug(`Sending email to ${su.email}...`);
            await Mail.send(
              su.email,
              `BenCo has not approved reimbursement: ${reimbursement.id}!`,
              `Hello ${su.firstName},\n\nThe Benefits coordinator has not approved the requested reimbursement from: ${employee.lastName}, ${employee.firstName}.\n\nThe reimbursement ID is: ${reimbursement.id}\n\nYours truly,\nTRMS\n\nTHIS WAS AN AUTOMATED MESSAGE.`,
              `<p>Hello ${su.firstName},</p>
              <p>
                The Benefits coordinator has not approved the requested reimbursement 
                from: ${employee.lastName}, ${employee.firstName}.
              </p>
              <p>
                Please verify the reimbursement (here is the <a href="${url}/${reimbursement.id}">link</a>), 
                and notify the benefits coordinator
              </p>
              <p>
                If the link does not work the reimbursement ID is: <strong>${reimbursement.id}</strong>
              </p>
              <p>Yours truly,</p>
              <p>TRMS</p>
              <hr>
              <small>THIS WAS AN AUTOMATED MESSAGE.</small>`,
            );
          }
          sleep(250);
        });

        return true;
      }

      log.error('[MAIL::DS:DNE] No director supervisor exist');
      return false;
    }

    log.error(`[MAIL::EMPLOYEE::DNE] Failed to send email because employee with id ${reimbursement.employeeId} does not exist!`);
    return false;
  }
}

export default new UserService();
