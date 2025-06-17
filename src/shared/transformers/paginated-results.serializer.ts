import { ApiProperty } from '@nestjs/swagger';

export interface IPaginatedResults<T> {
  data: T[];
  page: number;
  results: number;
  totalPages: number;
  totalResults: number;
}

export type PaginatedResultsProps<T> = Omit<IPaginatedResults<T>, 'totalPages'>;

export abstract class PaginatedResults<T = any>
  implements IPaginatedResults<T>
{
  constructor(props: PaginatedResultsProps<T>) {
    const { data, page, results, totalResults } = props;

    const totalPages =
      totalResults && results ? Math.ceil(totalResults / results) : 0;

    this.data = data;
    this.page = page;
    this.results = results;
    this.totalPages = totalPages;
    this.totalResults = totalResults;
  }

  readonly data: T[];

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly results: number;

  @ApiProperty()
  readonly totalPages: number;

  @ApiProperty()
  readonly totalResults: number;
}
