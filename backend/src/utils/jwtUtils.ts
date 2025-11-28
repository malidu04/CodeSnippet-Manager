import { jwtVerify, SignJWT } from 'jose'; // jose is used internally by jwt v9+
import { IUser } from '../models/User';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

export const jwtUtils = {
  async generateAccessToken(user: IUser): Promise<string> {
    return new SignJWT({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(process.env.JWT_ACCESS_EXPIRES_IN || '15m')
      .sign(JWT_SECRET);
  },

  async generateRefreshToken(user: IUser): Promise<string> {
    return new SignJWT({ id: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN || '7d')
      .sign(JWT_REFRESH_SECRET);
  },

  async verifyAccessToken(token: string): Promise<any> {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  },

  async verifyRefreshToken(token: string): Promise<any> {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return payload;
  },
};
