import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './permission.guard';
import { PermissionModule } from 'src/permission/permission.module';
import { RoleModule } from 'src/role/role.module';


@Module({
  imports: [
    UserModule,
    PermissionModule,
    RoleModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Er jonno double call hoy....So eita dorkar nai...
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionsGuard,
    // },
    AuthService, 
    JwtStrategy
  ],
  exports: [AuthService]
})
export class AuthModule {}