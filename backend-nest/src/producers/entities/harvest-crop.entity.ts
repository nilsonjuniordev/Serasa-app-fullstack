import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { Harvest } from './harvest.entity';

@Entity()
export class HarvestCrop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  cropName: string;

  @ManyToOne(() => Harvest, harvest => harvest.crops, {
    onDelete: 'CASCADE'
  })
  harvest: Harvest;
} 