import { User } from 'src/modules/user/entities/user.entity';

export type LoggedUser = Pick<User, 'id' | 'username' | 'role'>;
