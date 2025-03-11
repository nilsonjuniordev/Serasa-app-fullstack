import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from './entities/producer.entity';
import { Harvest } from './entities/harvest.entity';
import { HarvestCrop } from './entities/harvest-crop.entity';
import { ProducersService } from './services/producers.service';
import { ProducersController } from './controllers/producers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producer, Harvest, HarvestCrop])],
  controllers: [ProducersController],
  providers: [ProducersService],
})
export class ProducersModule {} 