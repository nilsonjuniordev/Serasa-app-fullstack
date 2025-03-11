import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProducersModule } from './producers/producers.module';
import { Producer } from './producers/entities/producer.entity';
import { Harvest } from './producers/entities/harvest.entity';
import { HarvestCrop } from './producers/entities/harvest-crop.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD?.replace(/"/g, '') || 'Be111290@#',
      database: process.env.DB_DATABASE || 'brain_agriculture',
      entities: [Producer, Harvest, HarvestCrop],
      synchronize: true,
    }),
    ProducersModule,
  ],
})
export class AppModule {}
