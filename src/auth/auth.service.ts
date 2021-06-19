import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService
    ){}

    async validateUser(body: any): Promise<any> {

        const {email, password} = body;
        // console.log('userEmail', email);
        
        // console.log('came here',user);
        try{
            const userObj = await this.userService.findUserByEmail(email);
            if(userObj){
                const isMatch = await bcrypt.compare(password, userObj.password);
                if(isMatch){
                    console.log(isMatch)
                    console.log(userObj)
                }
                else{
                    throw new HttpException("Your typed ("+password+") password is invalid password", HttpStatus.BAD_REQUEST)
                }
            }
            else{
                throw new HttpException(`Your typed ${email} email is not valid`, HttpStatus.BAD_REQUEST);
            }
            
        }
        catch(err){
            throw new HttpException(err.message, err.status)
        }
        return null;
      }
}

