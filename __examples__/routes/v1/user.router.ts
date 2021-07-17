import express, { Router } from 'express';
import StatusCodes from 'http-status-codes';
import userService, { UserService } from '../../services/user.service';
import reimbursementService from '../../services/reimbursement.service';
import { authenticate, validate } from '../utils';
import log from '../../log';
import GenericRouter, { ACCESS } from './generic/router';
import { UserRepository } from '../../repositories/user.repository';
import User from '../../models/user';
import { BadRequestError, ResourceDoesNotExistError } from '../../errors';

const router = Router();
const genericRouter = new GenericRouter<User, UserRepository, UserService>(userService, 'User');

const {
  OK,
} = StatusCodes;

export const me = async (req: express.Request, res: express.Response) => {
  log.debug(`Reached get ${genericRouter.logName} by session`);
  authenticate(req.session);
  const { user } = req.session;
  if (user) {
    const item = await userService.getById(user.id);
    return res.status(OK).json(item);
  }

  throw new BadRequestError('Missing session data?');
};

const getAllReimbursementsByEmployeeId = (access: ACCESS) => async (
  req: express.Request,
  res: express.Response,
) => {
  log.debug(`Reached get all reimbursements by ${genericRouter.logName} id route`);
  const { session } = req;
  await genericRouter.auth(access, session);
  const { id } = req.params;
  validate(id, 'Missing id parameter');
  const { user } = session;

  if (user) {
    const fetchedUser = await userService.getById(user ? user.id : 'nothing');
    const items = await reimbursementService.getAllByEmployeeId(user.id);
    if (fetchedUser && items) {
      if (fetchedUser.isSuperUser()
        || (items.length > 0 && items[0].employeeId === fetchedUser.id)
      ) {
        return res.status(OK).json(items);
      }
    }

    throw new ResourceDoesNotExistError(`The requested item was not found in ${genericRouter.logName} route`);
  }

  throw new BadRequestError(`Missing session data in route ${genericRouter.logName}`);
};

router.get('/me', me);
router.get('/reimbursements/:id', getAllReimbursementsByEmployeeId(ACCESS.LIMIT));
router.get('/', genericRouter.getAll());
router.get('/:id', genericRouter.getById(ACCESS.LIMIT));
router.post('/', genericRouter.addItem());
router.put('/', genericRouter.updateItem());
router.delete('/:id', genericRouter.deleteItem());

export default router;
