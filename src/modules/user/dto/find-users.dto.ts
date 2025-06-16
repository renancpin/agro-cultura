import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/shared/validators/pagination.dto';
import { FindManyOptions, ILike } from 'typeorm';
import { User } from '../entities/user.entity';

export class FindUsersDto extends PaginationDto {
  @IsOptional()
  name?: string;

  toQuery(): FindManyOptions<User> {
    return {
      ...super.toQuery(),
      where: {
        name: this.name ? ILike(this.name) : undefined,
      },
    };
  }
}
