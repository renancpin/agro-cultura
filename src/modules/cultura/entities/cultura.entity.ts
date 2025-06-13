import { Exclude, Transform } from 'class-transformer';
import { Fazenda } from '../../fazenda/entities/fazenda.entity';
import { pickProperties } from 'src/shared/transformers/pick-properties.transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DecimalType } from 'src/shared/helpers/column-definition.function';

@Entity()
export class Cultura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tipo_cultura' })
  tipoCultura: string;

  @Column(DecimalType({ name: 'area_hectares' }))
  areaHectares: number;

  @Column({ name: 'safra_ano', type: 'int' })
  safraAno: number;

  @Column({ name: 'data_plantio', type: 'date' })
  dataPlantio: Date;

  @Column({ name: 'data_colheita', type: 'date', nullable: true })
  dataColheita: Date | null;

  @Transform(
    (props: { value: Fazenda }) =>
      props.value && pickProperties(props.value, 'id', 'nome'),
  )
  @ManyToOne(() => Fazenda, { nullable: false })
  @JoinColumn({ name: 'fazenda_id' })
  fazenda: Fazenda;

  @Exclude()
  @Column({ name: 'fazenda_id' })
  fazendaId: string;
}
