import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';
import { PERMISSIONS_KEY } from './permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private userService: UserService,
        private permissionService: PermissionService,
        private roleService: RoleService
        
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission = this.reflector.get<number>(PERMISSIONS_KEY,
            context.getHandler(),
        );
        if (!requiredPermission) {
          return true;
        }
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        const myUser = user?.user;

        // console.log("request ==== ",request);
        // console.log("user ==== ",request?.user?.user);
        console.log("permissions ===== ",requiredPermission);
        // console.log("myUser ==== ", myUser);
        // console.log("user.id ==== ", user?.id);
        const role = myUser?.role;
        // console.log("role === ", role)
        const userPermissions = await this.roleService.findPermissionsByRolesId(role?.id);
        console.log("userPermissions ==== ", userPermissions);
        // const flag = requiredPermissions.map( (reqPermission) => {
        //     return userPermissions?.permission.find( userPermission =>{
        //         return userPermission.name === reqPermission;
        //     }) ? true : false;
        // })
        const flag = userPermissions?.permission.some((p) => {
            return p.id === requiredPermission;
        });
        // const flag = true;
        console.log("flag ", flag);
        if(flag){
            return flag;
        }
        else{
            throw new HttpException(`This ${requiredPermission} permission is not valid`, HttpStatus.NOT_FOUND)
        }
        // return flag[0];
        // return matchRoles(roles, user.roles);
    }
}
