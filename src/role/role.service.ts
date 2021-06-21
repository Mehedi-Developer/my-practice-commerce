import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionService } from 'src/permission/permission.service';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private permissionService: PermissionService

  ){}

  async create(role: CreateRoleDto) {
    try{
      const allRoles = await this.findAll();
      const existedRole = allRoles.find(r => r.name == role.name);
      // console.log(existedPermission);
      if(existedRole){
        throw new HttpException("This ("+role.name+") role is already in the list of permissions", HttpStatus.FOUND)
      }

      const {name, permission} = role;

      // if(!name && !permission){
      //   throw new HttpException(`Please set "role.name" & "role.permission" for this role`, HttpStatus.BAD_REQUEST);
      // }
      // else if(!permission){
      //   throw new HttpException(`Please set "role.permission" for this role`, HttpStatus.BAD_REQUEST);

      // }
      // else if(!name){
      //   throw new HttpException(`Please set "role.name" for this role`, HttpStatus.BAD_REQUEST);

      // }

      const switchCase = (!name && !permission) ? "NAME_PERMISSION_UNDEFINED" : !name ? "NAME_UNDEFINED" : !permission ? "PERMISSION_UNDEFINED" : "CREATE_ROLE";
      switch(switchCase){
        case "NAME_PERMISSION_UNDEFINED":
          throw new HttpException(`Please set "role.name" & "role.permission" for this role`, HttpStatus.BAD_REQUEST);
          
          case "NAME_UNDEFINED":
            throw new HttpException(`Please set "role.name" for this role`, HttpStatus.BAD_REQUEST);
            
          case "PERMISSION_UNDEFINED":
            throw new HttpException(`Please set "role.permission" for this role`, HttpStatus.BAD_REQUEST);
              
          default: 
            const roleObj = new Role();
            name && (roleObj.name = name);
            permission.length > 0 && (roleObj.permission = await this.permissionService.findRolePermissions(permission));
            // const rolePermission = 
            // console.log({roleObj})
            
            return this.roleRepository.save(roleObj);
      }
    }
    catch(err){
      throw new HttpException(err.message, err.status);
    }
    // console.log(role);
  }

  async findPermissionsByRolesId(roleId: number){
    if(roleId){
      // console.log('roleId', roleId);
      const permissionsByRoleId = await this.roleRepository
                                        .createQueryBuilder("role")
                                        .leftJoinAndSelect('role.permission',"role_permission")
                                        .where("role.id = :roleId ",{roleId})
                                        .getOne();
      // console.log('permissionsByRoleId===',permissionsByRoleId);
      // console.log('permissionsByRoleId===',permissionsByRoleId?.permission);
      
      return permissionsByRoleId;
    }
    // throw new HttpException("Role Id Didn't Not Found", HttpStatus.NOT_FOUND);
  }

  async findRoleById(rolesId: any){
    const rolesById = await this.roleRepository
    .createQueryBuilder("role")
    .select(["role"])
    .where('role.id IN (:...rolesId)', {rolesId})
    .getOne();
    return rolesById;
  }
  
  async findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: number) {
    try{
      const existedRole = await  this.roleRepository.findOne(id);
      if(!existedRole){
        throw new HttpException(`This (${id}) id is not available for role`, HttpStatus.NOT_FOUND);
      }
      // console.log({existedRole});
      return existedRole;
    }
    catch(err){
      throw new HttpException(err.message, err.status);
    }
  }

  async update(id: number, role: UpdateRoleDto) {
    try{
      const existedRole = await  this.roleRepository.findOne(id);
      if(!existedRole){
        throw new HttpException(`This (${id}) id is not available for role`, HttpStatus.NOT_FOUND);
      }

      const {name, permission} = role;
      if(!name && !permission){
        throw new HttpException(`Please set "role.name" & "role.permission" for the id-(${id}) in role`, HttpStatus.BAD_REQUEST);
      }
      const roleObj = new Role();
      name && (roleObj.name = name);
      permission.length > 0 && (roleObj.permission = await this.permissionService.findRolePermissions(permission));
      // console.log(roleObj);
      return this.roleRepository.update(id, roleObj);
    }
    catch(err){
      throw new HttpException(err.message, err.status);
    }
  }

  async remove(id: number) {
    try{
      const existedRole = await  this.roleRepository.findOne(id);
      if(!existedRole){
        throw new HttpException(`This (${id}) id is not available for role`, HttpStatus.NOT_FOUND);
      }
      return this.roleRepository.delete(id);
    }
    catch(err){
      throw new HttpException(err.message, err.status)
    }
  }
}
