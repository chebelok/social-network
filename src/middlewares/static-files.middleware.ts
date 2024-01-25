import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import * as mime from 'mime';

@Injectable()
export class StaticFilesMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: () => void) {
    const filePath = req.path;
    const contentType = mime.getType(filePath) || 'application/octet-stream';
    res.type(contentType);
    next();
  }
}