import { IsNotEmpty, IsString, IsNumber, Min, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHarvestCropDto {
  @IsNotEmpty()
  @IsString()
  cropName: string;
}

export class CreateHarvestDto {
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHarvestCropDto)
  crops: CreateHarvestCropDto[];
}

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  document: string;

  @IsNotEmpty()
  @IsString()
  farmName: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalArea: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  arableArea: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHarvestDto)
  harvests?: CreateHarvestDto[];
} 