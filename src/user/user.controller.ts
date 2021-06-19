import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/permission/permission.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { hasPermissions } from 'src/auth/permission/permission.decorator';
import { Permission } from 'src/auth/permission/permission.enum';
import { Observable } from 'rxjs';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags("User")
  @ApiOperation({summary: "User Sign Up"})
  @Post()
  create(@Body() user: CreateUserDto) {
    // console.log(user);
    return this.userService.signUp(user);  
  }
  
  @ApiTags("User")
  @ApiBearerAuth()
  @ApiOperation({summary: "Get All User"})
  @Get()
  @UseGuards(JwtAuthGuard)
  @UseGuards(PermissionGuard)
  @hasPermissions(Permission.Can_Manage_Product)
  findAll() {
    return this.userService.findAll();
  }
  
  @ApiTags("User")
  @ApiOperation({summary: "Get A User By Id"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  
  @ApiTags("User")
  @ApiOperation({summary: "Update A User By Id"})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
  
  @ApiTags("User")
  @ApiOperation({summary: "Delete A User By Id"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}