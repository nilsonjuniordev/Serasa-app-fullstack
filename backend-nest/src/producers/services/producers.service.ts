import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from '../entities/producer.entity';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { Harvest } from '../entities/harvest.entity';
import { HarvestCrop } from '../entities/harvest-crop.entity';

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private producerRepository: Repository<Producer>,
    @InjectRepository(Harvest)
    private harvestRepository: Repository<Harvest>,
    @InjectRepository(HarvestCrop)
    private harvestCropRepository: Repository<HarvestCrop>,
  ) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    const producer = this.producerRepository.create(createProducerDto);
    
    if (createProducerDto.harvests) {
      // Agrupa as safras por ano
      const harvestsByYear = this.groupHarvestsByYear(createProducerDto.harvests);
      
      producer.harvests = Object.entries(harvestsByYear).map(([year, crops]) => {
        const harvest = new Harvest();
        harvest.year = parseInt(year);
        harvest.crops = Array.from(new Set(crops)).map(cropName => {
          const harvestCrop = new HarvestCrop();
          harvestCrop.cropName = cropName;
          return harvestCrop;
        });
        return harvest;
      });
    } else {
      producer.harvests = [];
    }

    return this.producerRepository.save(producer);
  }

  private groupHarvestsByYear(harvests: any[]): { [key: string]: string[] } {
    return harvests.reduce((acc, harvest) => {
      const year = harvest.year.toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      harvest.crops.forEach((crop: any) => {
        if (!acc[year].includes(crop.cropName)) {
          acc[year].push(crop.cropName);
        }
      });
      return acc;
    }, {});
  }

  findAll(): Promise<Producer[]> {
    return this.producerRepository.find({
      relations: ['harvests', 'harvests.crops'],
      order: {
        harvests: {
          year: 'DESC'
        }
      }
    });
  }

  findOne(id: number): Promise<Producer | null> {
    return this.producerRepository.findOne({
      where: { id },
      relations: ['harvests', 'harvests.crops'],
      order: {
        harvests: {
          year: 'DESC'
        }
      }
    });
  }

  async update(id: number, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    const producer = await this.findOne(id);
    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${id} não encontrado`);
    }

    // Atualiza os dados básicos do produtor
    Object.assign(producer, updateProducerDto);

    // Se houver novas safras, processa elas
    if (updateProducerDto.harvests) {
      // Agrupa as safras por ano
      const harvestsByYear = this.groupHarvestsByYear(updateProducerDto.harvests);
      
      producer.harvests = Object.entries(harvestsByYear).map(([year, crops]) => {
        // Procura uma safra existente com o mesmo ano
        const existingHarvest = producer.harvests.find(h => h.year === parseInt(year));
        
        if (existingHarvest) {
          // Combina as culturas existentes com as novas, removendo duplicatas
          const allCropNames = new Set([
            ...existingHarvest.crops.map(c => c.cropName),
            ...crops
          ]);
          
          existingHarvest.crops = Array.from(allCropNames).map(cropName => {
            const existingCrop = existingHarvest.crops.find(c => c.cropName === cropName);
            if (existingCrop) return existingCrop;
            
            const harvestCrop = new HarvestCrop();
            harvestCrop.cropName = cropName;
            return harvestCrop;
          });
          
          return existingHarvest;
        } else {
          // Cria uma nova safra se não existir
          const harvest = new Harvest();
          harvest.year = parseInt(year);
          harvest.crops = Array.from(new Set(crops)).map(cropName => {
            const harvestCrop = new HarvestCrop();
            harvestCrop.cropName = cropName;
            return harvestCrop;
          });
          return harvest;
        }
      });
    }

    return this.producerRepository.save(producer);
  }

  async remove(id: number): Promise<void> {
    const producer = await this.findOne(id);
    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${id} não encontrado`);
    }

    await this.producerRepository.remove(producer);
  }

  async getDashboard() {
    const producers = await this.producerRepository.find({
      relations: ['harvests', 'harvests.crops'],
    });

    const totalFarms = producers.length;
    const totalArea = producers.reduce((sum, producer) => sum + producer.totalArea, 0);
    
    // Contagem de estados
    const stateCount = producers.reduce((acc, producer) => {
      acc[producer.state] = (acc[producer.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Contagem de culturas por safra agrupadas por ano
    const harvestsByYear = {} as Record<number, Record<string, number>>;
    
    // Para cada produtor/fazenda
    producers.forEach(producer => {
      // Para cada safra do produtor
      producer.harvests?.forEach(harvest => {
        const year = harvest.year;
        
        // Inicializa o ano se não existir
        if (!harvestsByYear[year]) {
          harvestsByYear[year] = {};
        }
        
        // Pega as culturas únicas desta safra
        const uniqueCrops = new Set(harvest.crops.map(crop => crop.cropName));
        
        // Para cada cultura única, incrementa o contador de fazendas
        uniqueCrops.forEach(cropName => {
          harvestsByYear[year][cropName] = (harvestsByYear[year][cropName] || 0) + 1;
        });
      });
    });

    // Contagem total de culturas (contando fazendas únicas por cultura)
    const cropCount = {} as Record<string, number>;
    
    producers.forEach(producer => {
      // Pega todas as culturas únicas deste produtor em todas as safras
      const uniqueCrops = new Set(
        producer.harvests?.flatMap(harvest => 
          harvest.crops.map(crop => crop.cropName)
        ) || []
      );
      
      // Para cada cultura única, incrementa o contador de fazendas
      uniqueCrops.forEach(cropName => {
        cropCount[cropName] = (cropCount[cropName] || 0) + 1;
      });
    });

    // Uso do solo
    const soilUse = {
      totalArea,
      arableArea: producers.reduce((sum, producer) => sum + producer.arableArea, 0),
      vegetationArea: producers.reduce((sum, producer) => sum + producer.vegetationArea, 0),
    };

    return {
      totalFarms,
      totalArea,
      stateCount,
      cropCount,
      harvestsByYear,
      soilUse,
    };
  }
} 