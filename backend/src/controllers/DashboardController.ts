import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Producer } from '../entities/Producer';

export class DashboardController {
    
  async getData(request: Request, response: Response) {
    console.log('Requisição recebida:', request.method, request.url);
    try {
      const producerRepository = AppDataSource.getRepository(Producer);
      
      // Buscar todos os produtores
      const producers = await producerRepository.find();
      
      // Total de fazendas
      const totalFarms = producers.length;
      
      // Total de área
      const totalArea = producers.reduce((sum, producer) => sum + producer.totalArea, 0);
      
      // Contagem por estado
      const stateCount = producers.reduce((acc, producer) => {
        acc[producer.state] = (acc[producer.state] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
      
      // Contagem por cultura
      const cropCount = producers.reduce((acc, producer) => {
        producer.crops.forEach(crop => {
          acc[crop] = (acc[crop] || 0) + 1;
        });
        return acc;
      }, {} as { [key: string]: number });
      
      // Soma das áreas
      const soilUse = producers.reduce((acc, producer) => {
        acc.arableArea += producer.arableArea;
        acc.vegetationArea += producer.vegetationArea;
        return acc;
      }, { arableArea: 0, vegetationArea: 0 });
      
      return response.json({
        totalFarms,
        totalArea,
        stateCount,
        cropCount,
        soilUse,
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      return response.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
} 