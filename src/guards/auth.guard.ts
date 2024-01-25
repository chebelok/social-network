import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { verifyToken } from "../utils/token.util";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const auth = context.switchToHttp().getRequest().headers.authorization;
    const token = auth.split(' ')[1];

    const tokenData = await verifyToken(token);
    return !!tokenData;
  }
}