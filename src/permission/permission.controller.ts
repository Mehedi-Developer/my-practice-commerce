import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiTags("Permission")
  @ApiOperation({summary: "Create Permission"})
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @ApiTags("Permission")
  @ApiOperation({summary: "Get All Permissions"})
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @ApiTags("Permission")
  @ApiOperation({summary: "Get A Permission By Id"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @ApiTags("Permission")
  @ApiOperation({summary: "Update A Permission By Id"})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @ApiTags("Permission")
  @ApiOperation({summary: "Delete A Permission By Id"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
