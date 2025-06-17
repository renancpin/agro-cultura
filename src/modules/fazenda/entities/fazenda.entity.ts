import { Produtor } from '../../produtor/entities/produtor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DecimalType } from 'src/shared/helpers/column-definition.function';
import { Exclude } from 'class-transformer';

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

  @ManyToOne(() => Produtor, { nullable: false })
  @JoinColumn({ name: 'produtor_id' })
  produtor: Produtor;

  @Exclude()
  @Column({ name: 'produtor_id' })
  produtorId: string;
}
