import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Producer } from './producer.entity';
import { HarvestCrop } from './harvest-crop.entity';

@Entity()
export class Harvest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ManyToOne(() => Producer, producer => producer.harvests, {
    onDelete: 'CASCADE'
  })
  producer: Producer;

  @OneToMany(() => HarvestCrop, harvestCrop => harvestCrop.harvest, {
    cascade: true,
    eager: true
  })
  crops: HarvestCrop[];
} 