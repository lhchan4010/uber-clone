import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    //리플렉터를 이용해 메타데이터에 설정된 역할을 가져온다.
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    //메타데이터가 없다면 모두가 접근 가능한 리졸버 이기 때문에 리졸버를 실행하기 위해 true를 반환한다.
    if (!roles) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const { user } = gqlContext['user'];
    if (!user) {
      return false;
    }
    if (roles.includes('Any')) {
      return true;
    }
    //유저에 설정된 역할과 메타데이터에 설정된 역할이 일치하는지 확인후 반환
    if (roles.includes(user.role)) {
      return true;
    }
  }
}
