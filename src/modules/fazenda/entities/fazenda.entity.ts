import { Exclude, Transform } from 'class-transformer';
import { Produtor } from '../../produtor/entities/produtor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { pickProperties } from 'src/shared/transformers/pick-properties.transformer';
import { DecimalType } from 'src/shared/helpers/column-definition.function';

@Entity()
export class Fazenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100 })
  cidade: string;

  @Column({ length: 100 })
  estado: string;

  @Column(DecimalType({ name: 'area_total_hectares' }))
  areaTotalHectares: number;

  @Column(DecimalType({ name: 'area_agricultavel_hectares' }))
  areaAgricultavelHectares: number;

  @Column(DecimalType({ name: 'area_vegetacao_hectares' }))
  areaVegetacaoHectares: number;

  @Transform(
    (props: { value: Fazenda }) =>
      props.value && pickProperties(props.value, 'id', 'nome'),
  )
  @ManyToOne(() => Produtor, { nullable: false })
  @JoinColumn({ name: 'produtor_id' })
  produtor: Produtor;

  @Exclude()
  @Column({ name: 'produtor_id' })
  produtorId: string;
}
