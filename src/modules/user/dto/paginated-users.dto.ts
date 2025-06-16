import { Type } from 'class-transformer';
import {
  PaginatedResults,
  PaginatedResultsProps,
} from 'src/shared/transformers/paginated-results.serializer';
import { User } from '../entities/user.entity';

export class PaginatedUsers extends PaginatedResults<User> {
  constructor(props: PaginatedResultsProps<User>) {
    super(props);
    this.data = props.data;
  }

  @Type(() => User)
  data: User[];
}
