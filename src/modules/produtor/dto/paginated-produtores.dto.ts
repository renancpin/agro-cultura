import {
  PaginatedResults,
  PaginatedResultsProps,
} from 'src/shared/transformers/paginated-results.serializer';
import { Produtor } from '../entities/produtor.entity';
import { Type } from 'class-transformer';

export class PaginatedProdutores extends PaginatedResults<Produtor> {
  constructor(props: PaginatedResultsProps<Produtor>) {
    super(props);
    this.data = props.data;
  }

  @Type(() => Produtor)
  data: Produtor[];
}
