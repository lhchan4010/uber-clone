import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';

export type AllowedRoles = keyof typeof UserRole | 'Any';

// 역할 메타데이터 설정
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
