import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/user/dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    
  ) {}

  @ApiTags("Login")
  @ApiOperation({summary: "Login For Authentication"})
  @Post("login")
  logIn(@Body() body: LoginDto){
    return this.authService.validateUser(body)
  }
}
