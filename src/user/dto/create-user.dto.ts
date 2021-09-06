import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {

    @IsString()
    @Matches(/^(?=.*[a-z])[a-z0-9]{4,20}$/, { message: '아이디의 길이는 4자 이상 20자 이하이며 영문자만으로 혹은 영문자와 숫자를 조합하여 사용 가능합니다.' })
    readonly id: string;

    @IsString()
    @Matches(/^[a-z0-9가-힣\\s]{4,20}$/, { message: '올바른 username이 아닙니다' })
    readonly username: string;

    @IsString()
    @Matches(/^\+[1-9]\d{1,14}$/, { message: '올바른 전화번호가 아닙니다 ex) +821000000000' })
    readonly phoneNumber: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,40}$/, { message: '비밀번호는 6자 이상 40자 이하이며 하나 이상의 숫자 및 문자가 필요합니다.' })
    readonly password: string

}