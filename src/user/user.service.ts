import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
// import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private permissionService: PermissionService,

    private roleService: RoleService,


  ){}

  async findRoleForUserId(roleId: number){
    const user_role = await this.userRepository
                      .createQueryBuilder("user")
                      .innerJoin("user.role", "role")
                      .select(["user.id","user.name", "user.mobile", "user.email", "role"])
                      .where("role.id = "+ roleId)
                      .getOne();
    return user_role;
  }
  async logIn(@Body() body: LoginDto){
    // Authentication Token Should Be Found Here, InshaAllah...
    const { email, password } = body;
    // return AuthService.validateUser(body.email, body.password)
    console.log('body: ' + body);
    
    // return this.authService.validateUser(email, password)
    // return result;
  }
  
  async findUserByEmail(email: string){
    const userByEmail =  await this.userRepository
    .createQueryBuilder("user")
    .innerJoin("user.role", "role")
    // .select(["user"])
    .select(["user","role"])
    .where({email})
    // .orWhere("user.mobile = :mobile ", {mobile})
    .getOne();
    return userByEmail;
  }

  async signUp( user: CreateUserDto) {
    try{
      // console.log({user});
      const saltRound = 10;
      // const hashPassword = await bcrypt.hashSync( user.password, 10);
      const hashPassword = await bcrypt.hashSync( user.password, saltRound);
      // console.log(hashPassword);
      const { name, email, mobile, roleId} = user;
      const existedEmail = await this.userRepository
                                .createQueryBuilder("user")
                                // .select(["user"])
                                .select(["user.email"])
                                .where({email})
                                // .orWhere("user.mobile = :mobile ", {mobile})
                                .getOne();

      const existedMobile = await this.userRepository
                                .createQueryBuilder("user")
                                // .select(["user"])
                                .select(["user.mobile"])
                                .where("user.mobile = :mobile ", {mobile})
                                // .orWhere("user.mobile = :mobile ", {mobile})
                                .getOne();

      // console.log(existedEmail);
      // console.log(existedMobile);
      if(existedEmail || existedMobile){
        if(existedEmail && existedMobile){
          throw new HttpException(`Both The email (${existedEmail.email}) and password (${existedMobile.mobile}) are already existed`, HttpStatus.FOUND);
        }
        else if(existedEmail){
          throw new HttpException(`This email (${email}) is already existed`, HttpStatus.FOUND);
        }
        else{
          throw new HttpException(`This mobile (${mobile}) is already existed`, HttpStatus.FOUND);
        } 
      }

      // console.log('reached here');
      
      const userObj = new User();
      userObj.name = name;
      userObj.email = email;
      userObj.mobile = mobile;
      userObj.password = hashPassword;

      // const roleById = await this.roleService.findOne(roleId);
      const roleById = await this.roleService.findRoleById(roleId);

      // console.log({roleById});
      userObj.role = roleById;
      // console.log(userObj)
      return this.userRepository.save(userObj);
    }
    catch(err){
      // console.error('error occurred',err);
      
      throw new HttpException(err.message, err.status)
    }
  }

  async findAll() {
    const users = await this.userRepository
                        .createQueryBuilder("user")
                        // .innerJoinAndMapMany('role.id', Role, 'role', "role.id = user.id")
                        .innerJoin("user.role", "role")
                        .select(["user.id","user.name", "user.mobile", "user.email", "role"])
                        .orderBy("user.id")
                        .getMany();

    // console.log(users)
    // return this.userRepository.find();
    return users;
  }

  async findOne(id: number) {
    try{
      const user = await this.userRepository
                         .createQueryBuilder("user")
                         .leftJoin("user.role", "role")
                         .select(["user.id", "user.name", "user.mobile", "user.email", "role"])
                         .where({id})
                         .getOne()
  
      console.log({user})
      if(!user){
        throw new HttpException(`The user is not found from this id (${id})`, HttpStatus.NOT_FOUND)
      }
      return user;
    }
    catch(err){
      throw new HttpException(err.message, err.status);
    }
    // return this.userRepository.findOne(id);
  }

  async update(id: number, upUser: UpdateUserDto) {
    try{
      const user = await this.userRepository
                         .createQueryBuilder("user")
                         .select(["user"])
                         .where({id})
                         .getOne();

      const userObj = new User();
      // const hashPassword = await bcrypt.hashSync( user.password, 10);
      upUser.name && (userObj.name = upUser.name);
      upUser.email && (userObj.email = upUser.email);
      const saltRound = 10; 
      const hashPassword = upUser.password && ( await bcrypt.hashSync( user.password, saltRound));
      upUser.password && (userObj.password = hashPassword);
      upUser.roleId && (userObj.role =  await this.roleService.findRoleById(id));

      console.log("Update User ==== ", userObj)
      if(!user){
        throw new HttpException(`The user is not found from this id (${id}) for updating`, HttpStatus.NOT_FOUND)
      }
      // string (password) ==> $2b$10$TfDBFQvPZ2MdngYRqNrsK.vNSZTrIU8BRgaiyP.cyEITv0nPCHSuu
      // 12345  (password) ==> $2b$10$waQLnVT3SsK0cGY9uRz6huqMb0JPRtnvwA9Znre0K1AIppyl.S6Xe
      return this.userRepository.update(id, userObj);
    }
    catch(err){
      throw new HttpException(err.message, err.status);
    }
  }

  async remove(id: number) {
    try{
      const user = await this.userRepository
                         .createQueryBuilder("user")
                         .select(["user"])
                         .where({id})
                         .getOne();

      if(!user){
        throw new HttpException(`The user is not found from this id (${id}) for deleting`, HttpStatus.NOT_FOUND)
      }
      return this.userRepository.delete(id);
    }
    catch(err){
      throw new HttpException(err.message, err.status);
    }
  }
}
