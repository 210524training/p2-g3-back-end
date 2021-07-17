import express, { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, ResourceDoesNotExistError } from '../../errors';
import log from '../../log';
import Reimbursement from '../../models/reimbursement';
import { ReimbursementRepository } from '../../repositories/reimbursement.repository';
import reimbursementService, { ReimbursementService } from '../../services/reimbursement.service';
import userService from '../../services/user.service';
import { validate } from '../utils';
import GenericRouter, { ACCESS } from './generic/router';

const { OK } = StatusCodes;

const router = Router();
const genericRouter = new GenericRouter<
  Reimbursement, ReimbursementRepository, ReimbursementService
>(reimbursementService, 'Reimbursement');

const getById = (access: ACCESS) => async (
  req: express.Request<{ id: string }, unknown, unknown, unknown, {}>,
  res: express.Response,
) => {
  log.debug(`Reached get ${genericRouter.logName} by id route`);
  const { session, session: { user }, params: { id } } = req;
  // const { session } = req;
  // const { user } = session;
  await genericRouter.auth(access, session);
  validate(id, `Missing get::id parameter for ${genericRouter.logName}`);
  const fetchedUser = user ? await userService.getById(user.id) : null;
  const item = await reimbursementService.getById(id);

  if (fetchedUser && item && (fetchedUser.isSuperUser() || fetchedUser.id === item.employeeId)) {
    return res.status(OK).json(item);
  }

  throw new ResourceDoesNotExistError('The reimbursement request was not found.');
};

const approve = (access: ACCESS) => async (
  req: express.Request<{ id: string }, unknown, { amount?: number }, unknown, {}>,
  res: express.Response,
) => {
  log.debug(`Reached get ${genericRouter.logName} by id route`);
  const {
    session,
    session: { user },
    params: { id },
    body: { amount },
  } = req;
  await genericRouter.auth(access, session);
  validate(id, `Missing get::id parameter for ${genericRouter.logName}`);
  const fetchedUser = user ? await userService.getById(user.id) : null;
  const item = await reimbursementService.getById(id);

  if (fetchedUser && item && fetchedUser.isSuperUser()) {
    item.approve(amount);
    res.status(200).json(await reimbursementService.update(item));
  }

  throw new ResourceDoesNotExistError('The reimbursement request was not found.');
};

const updateItem = (access: ACCESS) => async (
  req: express.Request<unknown, unknown, Reimbursement, unknown, {}>,
  res: express.Response,
) => {
  log.debug(`Reached put ${genericRouter.logName} route`);
  const { session, session: { user }, body } = req;
  // const { user } = session;
  await genericRouter.auth(access, session);
  validate(body, `Missing put::body for ${genericRouter.logName}`);
  const fetchedUser = user ? await userService.getById(user.id) : null;

  if (fetchedUser && (fetchedUser.isSuperUser() || fetchedUser.id === body.employeeId)) {
    return res.status(OK).json(
      await reimbursementService.update(body),
    );
  }

  throw new BadRequestError(`Missing session data in ${genericRouter.logName}`);
};

const deleteItem = (access: ACCESS) => async (
  req: express.Request<{ id: string }, unknown, unknown, unknown, {}>,
  res: express.Response,
) => {
  log.debug(`Reached delete ${genericRouter.logName} by id route`);
  const { params: { id }, session, session: { user } } = req;
  // const { session } = req;
  // const { user } = session;
  await genericRouter.auth(access, session);
  validate(id, `Missing delete::id in path for ${genericRouter.logName}`);
  const fetchedUser = user ? await userService.getById(user.id) : null;
  const item = await reimbursementService.getById(id);

  if (!item) {
    throw new ResourceDoesNotExistError('The reimbursement request was not found.');
  }

  if (fetchedUser && (fetchedUser.isSuperUser() || fetchedUser.id === item.employeeId)) {
    return res.status(OK).json(
      await reimbursementService.delete(id),
    );
  }

  throw new BadRequestError(`Missing session data in ${genericRouter.logName}`);
};

const getNotApprovedNotRejected = (access: ACCESS) => async (
  req: express.Request,
  res: express.Response,
) => {
  log.debug(`Reached get pending ${genericRouter.logName} route`);
  const { session, session: { user } } = req;
  // const { user } = session;
  await genericRouter.auth(access, session);
  const fetchedUser = user ? await userService.getById(user.id) : null;

  if (fetchedUser && fetchedUser.isSuperUser()) {
    return res.status(OK).json(
      await reimbursementService.getNotApprovedNorRejected(),
    );
  }

  throw new BadRequestError('user with the associated session id does not seem to exist');
};

const getAllAndUpdate = (access: ACCESS) => async (
  req: express.Request,
  res: express.Response,
) => {
  log.debug(`Reached get all ${genericRouter.logName} route`);
  const { session, session: { user } } = req;
  // const { user } = session;
  await genericRouter.auth(access, session);
  const fetchedUser = user ? await userService.getById(user.id) : null;

  if (fetchedUser && fetchedUser.isSuperUser()) {
    return res.status(OK).json(
      await reimbursementService.getAllAndUpdate(),
    );
  }

  throw new BadRequestError('user with the associated session id does not seem to exist');
};

router.post('/', genericRouter.addItem(ACCESS.LIMIT));

router.get('/', getAllAndUpdate(ACCESS.RESTRICT));
router.get('/pending', getNotApprovedNotRejected(ACCESS.RESTRICT));
router.get('/:id', getById(ACCESS.LIMIT));
router.put('/approve/:id', approve(ACCESS.RESTRICT));
router.put('/', updateItem(ACCESS.LIMIT));
router.delete('/:id', deleteItem(ACCESS.LIMIT));

export default router;
