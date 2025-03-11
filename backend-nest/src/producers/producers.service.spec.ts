import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProducersService } from './services/producers.service';
import { Producer } from './entities/producer.entity';
import { Harvest } from './entities/harvest.entity';
import { HarvestCrop } from './entities/harvest-crop.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProducersService', () => {
  let service: ProducersService;
  let repository: Repository<Producer>;

  const mockProducer = {
    id: 1,
    name: 'João Silva',
    document: '52998224725',
    farmName: 'Fazenda Boa Vista',
    city: 'São Paulo',
    state: 'SP',
    totalArea: 1000,
    arableArea: 800,
    vegetationArea: 200,
    harvests: [
      {
        id: 1,
        year: 2024,
        crops: [
          { id: 1, cropName: 'Soja' },
          { id: 2, cropName: 'Milho' }
        ]
      }
    ]
  };

  const mockProducerRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockHarvestRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockHarvestCropRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: getRepositoryToken(Producer),
          useValue: mockProducerRepository,
        },
        {
          provide: getRepositoryToken(Harvest),
          useValue: mockHarvestRepository,
        },
        {
          provide: getRepositoryToken(HarvestCrop),
          useValue: mockHarvestCropRepository,
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a producer with harvests', async () => {
      const createProducerDto = {
        name: 'João da Silva',
        document: '123.456.789-00',
        farmName: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 1000,
        arableArea: 800,
        vegetationArea: 200,
        harvests: [
          {
            year: 2024,
            crops: [
              { cropName: 'Soja' },
              { cropName: 'Milho' }
            ]
          }
        ]
      };

      const savedProducer = {
        ...createProducerDto,
        id: 1,
        harvests: [
          {
            id: 1,
            year: 2024,
            crops: [
              { id: 1, cropName: 'Soja' },
              { id: 2, cropName: 'Milho' }
            ]
          }
        ]
      };

      mockProducerRepository.create.mockReturnValue(createProducerDto);
      mockProducerRepository.save.mockResolvedValue(savedProducer);

      const result = await service.create(createProducerDto);

      expect(result).toEqual(savedProducer);
      expect(mockProducerRepository.create).toHaveBeenCalledWith(createProducerDto);
      expect(mockProducerRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid CPF', async () => {
      await expect(
        service.create({ ...mockProducer, document: '11111111111' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid area sum', async () => {
      await expect(
        service.create({
          ...mockProducer,
          totalArea: 500,
          arableArea: 300,
          vegetationArea: 300,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of producers', async () => {
      mockProducerRepository.find.mockResolvedValue([mockProducer]);
      const result = await service.findAll();
      expect(result).toEqual([mockProducer]);
    });
  });

  describe('findOne', () => {
    it('should return a producer', async () => {
      mockProducerRepository.findOne.mockResolvedValue(mockProducer);
      const result = await service.findOne(1);
      expect(result).toEqual(mockProducer);
    });

    it('should return null when producer not found', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a producer', async () => {
      mockProducerRepository.findOne.mockResolvedValue(mockProducer);
      mockProducerRepository.save.mockResolvedValue({ ...mockProducer, name: 'New Name' });

      const result = await service.update(1, { name: 'New Name' });
      expect(result.name).toBe('New Name');
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null);
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a producer', async () => {
      mockProducerRepository.findOne.mockResolvedValue(mockProducer);
      await service.remove(1);
      expect(mockProducerRepository.remove).toHaveBeenCalledWith(mockProducer);
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDashboard', () => {
    it('should return dashboard data', async () => {
      mockProducerRepository.find.mockResolvedValue([mockProducer]);
      
      const result = await service.getDashboard();
      
      expect(result).toEqual({
        totalFarms: 1,
        totalArea: 1000,
        stateCount: { SP: 1 },
        cropCount: { Soja: 1, Milho: 1 },
        soilUse: {
          totalArea: 1000,
          arableArea: 800,
          vegetationArea: 200,
        },
      });
    });
  });
}); 