import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

type NewType = Repository<Permission>;

@Injectable()
export class PermissionService {
  constructor(

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>
    // private permissionRepository: NewType

  ){}

  async findRolePermissions(permission: any){
    const rolePermission = await this.permissionRepository
    .createQueryBuilder("permission")
    .select(["permission"])
    .where("permission.id IN (:...permission)", { permission })
    .orderBy("permission.id")
    .getMany();
    // console.log({rolePermission})
    return rolePermission;
  }
  async create(permission: CreatePermissionDto) {
    // console.log({permission})
    const userPermission = await this.permissionRepository.save(permission);
    // const userPermission = permissionRepository.create(permission);
    // console.log({userPermission})
    return userPermission;
  }

  async findAll() {
    return await this.permissionRepository.find();
  }

  async findOne(id: number) {
    return await this.permissionRepository.findOne(id);
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionRepository.update(id, updatePermissionDto)
  }

  async remove(id: number) {
    return await this.permissionRepository.delete(id);
  }
}
