import { Harvest } from './harvest';

export interface Producer {
  id: number;
  name: string;
  document: string;
  farmName: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  harvests: Harvest[];
}

export interface CreateHarvestCrop {
  cropName: string;
}

export interface CreateHarvest {
  year: number;
  crops: CreateHarvestCrop[];
}

export interface ProducerFormData extends Omit<Producer, 'id' | 'harvests'> {
  harvests?: CreateHarvest[];
}

export interface DashboardData {
  totalFarms: number;
  totalArea: number;
  stateCount: Record<string, number>;
  cropCount: Record<string, number>;
  harvestsByYear: Record<number, Record<string, number>>;
  soilUse: {
    totalArea: number;
    arableArea: number;
    vegetationArea: number;
  };
} 