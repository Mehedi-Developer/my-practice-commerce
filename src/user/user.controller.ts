import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

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