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
    this.totalPages = totalPages;
    this.totalResults = totalResults;
  }

  readonly data: T[];
  readonly page: number;
  readonly results: number;
  readonly totalPages: number;
  readonly totalResults: number;
}
