// Nest dependencies
import {
    Injectable,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

// Other dependencies
import { validate } from "class-validator"

// Local files
import { UserRepository } from "src/shared/repositories/user.repository"

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async getUserListbyUsername(keyword: string, page: number) {
        const data = await this.userRepository.getUserListbyUsername(
            keyword,
            page,
        )
        return {
            data: data.data.map((item) => {
                const { password, phoneNumber, point, ...other } = item
                return {
                    ...other,
                }
            }),
            count: data.count,
        }
    }
}
