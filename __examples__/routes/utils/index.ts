import { Session, SessionData } from 'express-session';
import { AuthenticationError, AuthorizationError, ValidationError } from '../../errors';
import userService from '../../services/user.service';

export type Data = Session & Partial<SessionData>
export const authenticate = (session: Data): void => {
  const { isLoggedIn, user } = session;
  if (!isLoggedIn || !user) {
    throw new AuthenticationError('You must be logged in to access this functionality');
  }
};

export const authorize = async (session: Data): Promise<void> => {
  const { user } = session;
  if (!user || !(await userService.isSuper(user.id))) {
    throw new AuthorizationError('You are not allowed to access this functionality.');
  }
};

export const authenticateAndAuthorize = async (session: Data): Promise<void> => {
  authenticate(session);
  await authorize(session);
};

export const msg = (message: string = 'Needs more information.'): { message: string } => ({ message });

export const validate = (o: any, message: string = 'Missing information.'): void => {
  if (!o) {
    throw new ValidationError(message);
  }
};
