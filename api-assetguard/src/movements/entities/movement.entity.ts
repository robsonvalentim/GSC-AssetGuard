import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Collaborator } from '../../collaborators/entities/collaborator.entity';
import { Asset } from '../../assets/entities/asset.entity';

export enum ReturnCondition {
  OK = 'OK',
  DEFEITO_TELA = 'DEFEITO_TELA',
  DEFEITO_BATERIA = 'DEFEITO_BATERIA',
  DEFEITO_LEITOR = 'DEFEITO_LEITOR',
  DEFEITO_TOUCH = 'DEFEITO_TOUCH',
  DEFEITO_TECLADO = 'DEFEITO_TECLADO',
}

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Relacionamento com o Colaborador
  @ManyToOne(() => Collaborator)
  @JoinColumn({ name: 'collaboratorId' })
  collaborator!: Collaborator;

  @Column()
  collaboratorId!: string;

  // Relacionamento com o Ativo (Coletor)
  @ManyToOne(() => Asset)
  @JoinColumn({ name: 'assetId' })
  asset!: Asset;

  @Column()
  assetId!: string;

  // checkOutAt preenchido automaticamente na criacao
  @CreateDateColumn()
  checkOutAt!: Date;

  // checkInAt aceita nulo pois na retirada a devolucao ainda nao existe
  @Column({ type: 'datetime', nullable: true })
  checkInAt!: Date | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  returnCondition!: ReturnCondition | null;

  @Column({ type: 'text', nullable: true })
  observation!: string | null;
}