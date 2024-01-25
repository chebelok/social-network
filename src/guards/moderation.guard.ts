import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class ModerationGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const status = context.switchToHttp().getRequest().body.status;
    return ['APPROVED', 'REJECTED'].includes(status);
  }
}