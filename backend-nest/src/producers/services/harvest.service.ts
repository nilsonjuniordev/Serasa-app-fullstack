import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Harvest } from '../entities/harvest.entity';
import { HarvestCrop } from '../entities/harvest-crop.entity';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { Producer } from '../entities/producer.entity';

@Injectable()
export class HarvestService {
  constructor(
    @InjectRepository(Harvest)
    private harvestRepository: Repository<Harvest>,
    @InjectRepository(Producer)
    private producerRepository: Repository<Producer>,
    @InjectRepository(HarvestCrop)
    private harvestCropRepository: Repository<HarvestCrop>,
  ) {}

  async create(producerId: number, createHarvestDto: CreateHarvestDto): Promise<Harvest> {
    const producer = await this.producerRepository.findOne({ where: { id: producerId } });
    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }

    const harvest = this.harvestRepository.create({
      year: createHarvestDto.year,
      producer,
    });

    const savedHarvest = await this.harvestRepository.save(harvest);

    const crops = createHarvestDto.crops.map(cropName => {
      return this.harvestCropRepository.create({
        cropName,
        harvest: savedHarvest,
      });
    });

    await this.harvestCropRepository.save(crops);
    savedHarvest.crops = crops;

    return savedHarvest;
  }

  async findAllByProducer(producerId: number): Promise<Harvest[]> {
    return this.harvestRepository.find({
      where: { producer: { id: producerId } },
      relations: ['crops'],
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.harvestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Safra não encontrada');
    }
  }
} 