import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PermissionsGuard } from './auth/permission.guard';
import { PermissionService } from './permission/permission.service';
import { RoleService } from './role/role.service';
import { UserService } from './user/user.service';
// import { PermissionsGuard } from './auth/permission.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(new PermissionsGuard(Reflector, UserService, RoleService, PermissionService));
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('My Practice Commerce Example')
    .setDescription('The Practice Commerce API Description')
    .setVersion('1.0')
    .addTag('Login')
    .addTag('User')
    .addTag('Permission')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000);
}
bootstrap();
