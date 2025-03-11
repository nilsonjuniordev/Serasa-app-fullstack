import { IsNotEmpty, IsNumber, IsArray, IsString } from 'class-validator';

export class CreateHarvestDto {
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsArray()
  @IsString({ each: true })
  crops: string[];
} 