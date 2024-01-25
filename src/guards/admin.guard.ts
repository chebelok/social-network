import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { decodeToken } from "../utils/token.util";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor (private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const auth = context.switchToHttp().getRequest().headers.authorization;
    const token = auth.split(' ')[1];

    const email = await decodeToken(token).then(payload => payload.email);
    return await this.userService.isAdmin(email);

  }
}