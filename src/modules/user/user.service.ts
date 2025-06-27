import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindUsersDto } from './dto/find-users.dto';
import { PaginatedUsers } from './dto/paginated-users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);

    return hash;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const usernameAlreadyExists = await this.usersRepository.exists({
      where: { username: userData.username },
    });
    if (usernameAlreadyExists) {
      throw new UnauthorizedException('Nome de usuário já existe');
    }

    const hashedPassword = await this.hashPassword(userData.password);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    return user;
  }

  async findAll(props: FindUsersDto): Promise<PaginatedUsers> {
    const query = props.toQuery();
    const [users, total] = await this.usersRepository.findAndCount(query);

    const userResult = new PaginatedUsers({
      data: users,
      page: props.page,
      results: props.results,
      totalResults: total,
    });

    return userResult;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { username: username },
    });

    return user;
  }

  async update(username: string, userData: UpdateUserDto): Promise<boolean> {
    if (userData.password) {
      const hashedPassword = await this.hashPassword(userData.password);
      userData.password = hashedPassword;
    }

    const result = await this.usersRepository.update(
      { username: username },
      userData,
    );
    if (!result.affected) return false;

    return true;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) return false;

    return true;
  }
}
