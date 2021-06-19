import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiTags("Role")
  @ApiOperation({summary: "Create Role By Inserting Permission Id(Number Type...Like: [2, 5, 1,....]) As An Element Of Role Permission"})
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiTags("Role")
  @ApiOperation({summary: "Get all roles"})
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @ApiTags("Role")
  @ApiOperation({summary: "Get A Role By Id"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @ApiTags("Role")
  @ApiOperation({summary: "Update A Role By Id"})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @ApiTags("Role")
  @ApiOperation({summary: "Delete A Role By Id"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
