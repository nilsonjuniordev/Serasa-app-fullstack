export interface Producer {
  id?: number;
  document: string;
  name: string;
  farmName: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  crops: string[];
}

export interface DashboardData {
  totalFarms: number;
  totalArea: number;
  stateCount: Record<string, number>;
  cropCount: Record<string, number>;
  soilUse: {
    arableArea: number;
    vegetationArea: number;
  };
} 