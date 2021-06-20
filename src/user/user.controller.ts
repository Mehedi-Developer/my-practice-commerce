import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { PermissionsGuard } from 'src/auth/permission.guard';
import { hasPermissions } from 'src/auth/permission.decorator';
import { Permission } from 'src/auth/permission.enum';
// import { Observable } from 'rxjs';
// import { User } from './entities/user.entity';

@UseGuards(JwtAuthGuard)
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
  @ApiOperation({summary: "Get All User"})
  @Get()
  // Local Guard For Permission To Access Api
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  // Local E JwtAuthGuard Use Korle Obshsoi PermissionsGuard Er Por Use Korte Hobe Onnothay Global E Korle Problem Nai
  // @UseGuards(JwtAuthGuard)
  @hasPermissions(Permission.Can_Manage_Product)
  findAll() {
    return this.userService.findAll();
  }
  
  @ApiTags("User")
  @ApiOperation({summary: "Get A User By Id"})
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @hasPermissions(Permission.Can_Response_Staff)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  
  @ApiTags("User")
  @ApiOperation({summary: "Update A User By Id"})
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @hasPermissions("Can Manage Product")
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