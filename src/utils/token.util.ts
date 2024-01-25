import * as jwt from 'jsonwebtoken';

export const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
};

export const decodeToken = (token: string): Promise<any> => { 
  return new Promise((resolve) => {
    resolve(jwt.decode(token, { complete: true }).payload);
  });
}
