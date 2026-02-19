import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AssetStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  OVERDUE = 'OVERDUE',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  internalId!: string;

  @Column({ unique: true })
  serialNumber!: string;

  @Column()
  model!: string;

  @Column({
    type: 'varchar',
    default: AssetStatus.AVAILABLE,
  })
  status!: AssetStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}