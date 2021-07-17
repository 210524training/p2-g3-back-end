import express from 'express';
import { StatusCodes } from 'http-status-codes';
import log from '../../../log';
import { IEntity } from '../../../@types/trms/index.d';
import Repository from '../../../repositories/generic/repository';
import Service from '../../../services/generic/service';
import {
  authenticate, authenticateAndAuthorize, Data, validate,
} from '../../utils';

const {
  OK, CREATED,
} = StatusCodes;

/**
 * Limits access to a route's path when passed to a generic (`GenericRouter`)
 * route function. See implementation. All generic routes are restictive by default.
 */
export enum ACCESS {
  /**
   * Authentication and authorization
   */
  RESTRICT,
 /**
  * Authenticate only
  */
  LIMIT,
  /**
   * No authorization nor authentication
   */
  ALLOW,
}

/**
 * Generic routes for the service logic.
 * @author Dustin Diaz
 */
export default class GenericRouter<
  E extends IEntity,
  R extends Repository<E>,
  S extends Service<E, R>,
> {
  constructor(
    protected service: S,
    public logName: string,
  ) {}

  public auth = async (
    access: ACCESS,
    session: Data,
  ) => {
    log.debug(access);
    switch (access) {
    case ACCESS.RESTRICT:
      await authenticateAndAuthorize(session);
      break;
    case ACCESS.LIMIT:
      authenticate(session);
      break;
    default:
      break;
    }
  }

  /**
   * Expected path `'/'`
   *
   * No body
   */
  public getAll = (access: ACCESS = ACCESS.RESTRICT) => async (
    req: express.Request,
    res: express.Response,
  ) => {
    log.debug(`Reached get all entity (${this.logName}) route`);
    await this.auth(access, req.session);
    const items = await this.service.getAll();
    return res.status(OK).json(items);
  };

  /**
   * Expected path `'/:id'`
   *
   * No body
   */
  public getById = (access: ACCESS = ACCESS.RESTRICT) => async (
    req: express.Request,
    res: express.Response,
  ) => {
    log.debug(`Reached get entity (${this.logName}) by id route`);
    await this.auth(access, req.session);
    const { id } = req.params;
    validate(id, `(${this.logName}) Missing id parameter`);
    const item = await this.service.getById(id);
    return res.status(OK).json(item);
  };

  /**
   * Expected path `'/'`
   *
   * Entity `<E>` in body
   */
  public addItem = (access: ACCESS = ACCESS.RESTRICT) => async (
    req: express.Request<unknown, unknown, E, unknown, {}>,
    res: express.Response,
  ) => {
    log.debug(`Reached create entity (${this.logName}) route`);
    await this.auth(access, req.session);
    validate(req.body, `(${this.logName}): Missing request body`);
    const created = await this.service.add(req.body);
    return res.status(created ? CREATED : OK).json(created);
  };

  /**
   * Expected path `'/'`
   *
   * entity `<E>` in body
   */
  public updateItem = (access: ACCESS = ACCESS.RESTRICT) => async (
    req: express.Request<unknown, unknown, E, unknown, {}>,
    res: express.Response,
  ) => {
    log.debug(`Reached updated entity (${this.logName}) route`);
    await this.auth(access, req.session);
    validate(req.body, `(${this.logName}): Missing body in request.`);
    const updated = await this.service.update(req.body);
    return res.status(updated ? CREATED : OK).json(updated);
  };

  /**
   * Expected path `'/:id'`
   *
   * No body
   */
  public deleteItem = (access: ACCESS = ACCESS.RESTRICT) => async (
    req: express.Request,
    res: express.Response,
  ) => {
    log.debug(`Reached delete entity (${this.logName}) route`);
    await this.auth(access, req.session);
    const { id } = req.params;
    validate(id, 'Missing id parameter.');
    const deleted = await this.service.delete(id);
    return res.status(OK).json(deleted);
  };
}
