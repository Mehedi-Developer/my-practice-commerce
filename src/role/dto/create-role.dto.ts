import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Permission } from "src/permission/entities/permission.entity";

export class CreateRoleDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString({message: "This is not a name."})
    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray({message: "This is will be array element for permission id"})
    permission: number[];
}
