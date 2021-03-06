import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BackendLogger } from 'src/logger/BackendLogger';
import { User } from 'src/user/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  private readonly logger = new BackendLogger(GqlRolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    const hasRole = () =>
      user.roles.some(
        (role) => !!roles.find((item) => item === role.name && role.enabled)
      );

    return user && user.roles && hasRole();
  }
}
