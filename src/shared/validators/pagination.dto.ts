import { SejaInteiroPositivo } from './validadores.decorator';
import { Type } from 'class-transformer';

export interface IPaginationProps {
  page: number;
  results: number;
}

export interface IPaginationQuery {
  skip?: number;
  take?: number;
}

export class PaginationDto implements IPaginationProps {
  constructor(props?: Partial<IPaginationProps>) {
    const { page, results } = props ?? {};
    if (page) this.page = page;
    if (results) this.results = results;
  }

  @SejaInteiroPositivo()
  @Type(() => Number)
  page = 1;

  @SejaInteiroPositivo()
  @Type(() => Number)
  results = 50;

  toQuery(): IPaginationQuery {
    return {
      take: this.results,
      skip: (this.page - 1) * this.results,
    };
  }
}
