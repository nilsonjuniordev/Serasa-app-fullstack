import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Producer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  document: string;

  @Column()
  farmName: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column("float")
  totalArea: number;

  @Column("float")
  arableArea: number;

  @Column("float")
  vegetationArea: number;

  @Column("simple-array")
  crops: string[];
} 