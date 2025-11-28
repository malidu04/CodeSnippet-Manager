import { IUser } from '../../models/User';

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
      query: {
        page?: string;
        limit?: string;
        programmingLanguage?: string;
        search?: string;
        category?: string;
        tags?: string;
        [key: string]: any;
      };
    }
  }
}

export {};