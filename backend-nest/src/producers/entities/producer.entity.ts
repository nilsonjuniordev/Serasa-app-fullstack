import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { Harvest } from './harvest.entity';

@Entity()
export class Producer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  document: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  farmName: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  city: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  state: string;

  @Column('float')
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalArea: number;

  @Column('float')
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  arableArea: number;

  @Column('float')
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @OneToMany(() => Harvest, harvest => harvest.producer, {
    cascade: true,
    eager: true
  })
  harvests: Harvest[];
} 