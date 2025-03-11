import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producer } from '../src/producers/entities/producer.entity';

describe('ProducersController (e2e)', () => {
  let app: INestApplication;
  let mockRepository;

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

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn().mockResolvedValue([mockProducer]),
      findOne: jest.fn().mockResolvedValue(mockProducer),
      create: jest.fn().mockReturnValue(mockProducer),
      save: jest.fn().mockResolvedValue(mockProducer),
      remove: jest.fn().mockResolvedValue(mockProducer),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Producer))
      .useValue(mockRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/produtores (GET)', () => {
    it('should return all producers', () => {
      return request(app.getHttpServer())
        .get('/produtores')
        .expect(200)
        .expect([mockProducer]);
    });
  });

  describe('/produtores (POST)', () => {
    it('should create a producer', () => {
      const producer = {
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

      return request(app.getHttpServer())
        .post('/produtores')
        .send(producer)
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(producer.name);
          expect(res.body.harvests).toHaveLength(1);
          expect(res.body.harvests[0].crops).toHaveLength(2);
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/produtores')
        .send({})
        .expect(400);
    });
  });

  describe('/produtores/:id (GET)', () => {
    it('should return a producer', () => {
      return request(app.getHttpServer())
        .get('/produtores/1')
        .expect(200)
        .expect(mockProducer);
    });

    it('should return 404 when producer not found', () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      return request(app.getHttpServer())
        .get('/produtores/999')
        .expect(404);
    });
  });

  describe('/produtores/:id (PUT)', () => {
    it('should update a producer', () => {
      const updateData = { name: 'New Name' };
      return request(app.getHttpServer())
        .put('/produtores/1')
        .send(updateData)
        .expect(200);
    });

    it('should return 404 when producer not found', () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      return request(app.getHttpServer())
        .put('/produtores/999')
        .send({ name: 'New Name' })
        .expect(404);
    });
  });

  describe('/produtores/:id (DELETE)', () => {
    it('should delete a producer', () => {
      return request(app.getHttpServer())
        .delete('/produtores/1')
        .expect(200);
    });

    it('should return 404 when producer not found', () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      return request(app.getHttpServer())
        .delete('/produtores/999')
        .expect(404);
    });
  });

  describe('/produtores/dashboard (GET)', () => {
    it('should return dashboard data', () => {
      return request(app.getHttpServer())
        .get('/produtores/dashboard')
        .expect(200)
        .expect({
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