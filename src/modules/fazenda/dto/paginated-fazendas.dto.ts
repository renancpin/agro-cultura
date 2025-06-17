import { Type } from 'class-transformer';
import {
  PaginatedResults,
  PaginatedResultsProps,
} from 'src/shared/transformers/paginated-results.serializer';
import { Fazenda } from '../entities/fazenda.entity';

class ResumedFazenda implements Omit<Fazenda, 'produtor' | 'produtorId'> {
  constructor(props: Fazenda) {
    this.id = props.id;
    this.nome = props.nome;
    this.cidade = props.cidade;
    this.estado = props.estado;
    this.areaAgricultavelHectares = props.areaAgricultavelHectares;
    this.areaVegetacaoHectares = props.areaVegetacaoHectares;
    this.areaTotalHectares = props.areaTotalHectares;

    this.produtor = { id: props.produtorId, nome: props.produtor.nome };
  }

  id: string;
  nome: string;
  cidade: string;
  estado: string;
  areaTotalHectares: number;
  areaAgricultavelHectares: number;
  areaVegetacaoHectares: number;
  produtor: {
    id: string;
    nome: string;
  };
}

export class PaginatedFazendas extends PaginatedResults<ResumedFazenda> {
  constructor(props: PaginatedResultsProps<Fazenda>) {
    super(props);
    this.data = props.data.map((fazenda) => new ResumedFazenda(fazenda));
  }

  @Type(() => ResumedFazenda)
  data: ResumedFazenda[];
}
