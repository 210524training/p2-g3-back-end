import express, { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
// import { UploadedFile } from 'express-fileupload';
import userService from '../services/user.service';
import userRouterV1 from './v1/user.router';
import reimbursementRouterV1 from './v1/reimbursement.router';
import gradeFormatRouterV1 from './v1/grade-format.router';
// import { BadRequestError } from '../errors';
// import log from '../log';

const baseRouter = Router();

const {
  OK, ACCEPTED,
} = StatusCodes;

export const login = async (
  req: express.Request<unknown, unknown, { username: string, password: string }, unknown, {}>,
  res: express.Response,
): Promise<void> => {
  const { username, password } = req.body;
  const user = await userService.login(username, password);
  req.session.isLoggedIn = true;
  req.session.user = user;
  res.status(OK).json(req.session.user);
};

export const logout = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  if (req.session.user) {
    const { username } = req.session.user;
    req.session.destroy(() => {
      console.log(`${username} logged out`);
    });
  }
  res.status(ACCEPTED).send();
};

baseRouter.post('/login', login);
baseRouter.post('/logout', logout);
// baseRouter.post('/upload', async (
//   req: express.Request,
//   res: express.Response,
// ) => {
//   const { files, session: { user }, body: { id } } = req;

//   if (!files || !user || !id) {
//     throw new BadRequestError('No file was uploaded, not logged in, or the reimbursement id was not provided.');
//   }

//   const { file } = files;
//   log.debug(file);
//   // log.debug(file instanceof UploadedFile);
//   res.json(files);
// });

baseRouter.use('/api/v1/users', userRouterV1);
baseRouter.use('/api/v1/reimbursements', reimbursementRouterV1);
baseRouter.use('/api/v1/grade-formats', gradeFormatRouterV1);

export default baseRouter;
