import { Type } from 'class-transformer';
import {
  PaginatedResults,
  PaginatedResultsProps,
} from 'src/shared/transformers/paginated-results.serializer';
import { Cultura } from '../entities/cultura.entity';

class ResumedCultura
  implements Omit<Cultura, 'fazenda' | 'fazendaId' | 'dataColheita'>
{
  constructor(props: Cultura) {
    this.id = props.id;
    this.tipoCultura = props.tipoCultura;
    this.areaHectares = props.areaHectares;
    this.safraAno = props.safraAno;
    this.dataPlantio = props.dataPlantio;
    this.dataColheita = props.dataColheita ?? undefined;
    this.fazenda = {
      id: props.fazendaId,
      nome: props.fazenda?.nome,
      produtorId: props.fazenda?.id,
    };
  }

  id: string;
  tipoCultura: string;
  areaHectares: number;
  safraAno: number;
  dataPlantio: Date;
  dataColheita?: Date | null;
  fazenda: {
    id: string;
    nome: string;
    produtorId: string;
  };
}

export class PaginatedCulturas extends PaginatedResults<ResumedCultura> {
  constructor(props: PaginatedResultsProps<Cultura>) {
    super(props);
    this.data = props.data.map((cultura) => new ResumedCultura(cultura));
  }

  @Type(() => ResumedCultura)
  data: ResumedCultura[];
}
