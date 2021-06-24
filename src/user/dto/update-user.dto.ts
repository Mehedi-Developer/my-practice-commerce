import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Role } from 'src/role/entities/role.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

	@ApiProperty()
	id: number;
	
}
