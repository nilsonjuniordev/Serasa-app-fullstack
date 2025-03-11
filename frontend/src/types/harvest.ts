export interface HarvestCrop {
  id: number;
  cropName: string;
}

export interface Harvest {
  id: number;
  year: number;
  crops: HarvestCrop[];
}

export interface CreateHarvestDto {
  year: number;
  crops: string[];
} 