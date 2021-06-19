import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { Permission } from './permission/entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role/entities/role.entity';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'my-practice_commerce',
    entities: [Permission, Role, User],
    synchronize: true,
  }),
   UserModule, 
   RoleModule, 
   PermissionModule, AuthModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
