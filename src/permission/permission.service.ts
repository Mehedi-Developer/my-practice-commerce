import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async findRolePermissions(permissionIds: number[]){
    // console.log(...permission)
    // const rolePermission = await this.permissionRepository
    // .createQueryBuilder("permission")
    // .select(["permission"])
    // .where("permission.id IN (:...permission)", { permission })
    // .orderBy("permission.id")
    // .getMany();
    // console.log({rolePermission})
    // return rolePermission;
	  return await this.permissionRepository.find({id: In(permissionIds)})
  }

  async create(permission: CreatePermissionDto) {
    console.log({permission})
    try{
      // console.log(permission)
      // const allPermissions = await this.findAll();
      // const existedPermission = allPermissions.find(p => p.name == permission.name);
      const existedPermission = await this.permissionRepository.findOne({name: permission.name});
      // console.log({existedPermission});
      if(existedPermission){
        throw new HttpException("This ("+permission.name+") permission is already in the list of permissions", HttpStatus.FOUND)
      }
      const userPermission = await this.permissionRepository.save(permission);
      // // const userPermission = permissionRepository.create(permission);
      // // console.log({userPermission})
      return userPermission;
    }
    catch(err){
      throw new HttpException(err.message, err.status);
    }
  }

  async findAll() {
    return await this.permissionRepository.find();
  }

  async findOne(id: number) {
    try{
      const existedPermission = await this.permissionRepository.findOne(id);
      if(!existedPermission){
        throw new HttpException(`This (${id}) id is not available for permission`, HttpStatus.NOT_FOUND);
      }
      return existedPermission;
    }
    catch(err){
      throw new HttpException(err.message, err.status)
    }
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try{
      const existedPermission = await this.permissionRepository.findOne(id);
      if(!existedPermission){
        throw new HttpException(`This (${id}) id is not available for permission`, HttpStatus.NOT_FOUND);
      }
      return await this.permissionRepository.update(id, updatePermissionDto)
    }
    catch(err){
      throw new HttpException(err.message, err.status)
    }
  }
  
  async remove(id: number) {
    try{
      const existedPermission = await this.permissionRepository.findOne(id);
      if(!existedPermission){
        throw new HttpException(`This (${id}) id is not available for permission`, HttpStatus.NOT_FOUND);
      }
      return await this.permissionRepository.delete(id);
    }
    catch(err){
      throw new HttpException(err.message, err.status)
    }
  }
}
