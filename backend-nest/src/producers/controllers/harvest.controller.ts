import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HarvestService } from '../services/harvest.service';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { Harvest } from '../entities/harvest.entity';

@Controller('produtores/:producerId/harvests')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  create(
    @Param('producerId') producerId: string,
    @Body() createHarvestDto: CreateHarvestDto,
  ): Promise<Harvest> {
    return this.harvestService.create(+producerId, createHarvestDto);
  }

  @Get()
  findAll(@Param('producerId') producerId: string): Promise<Harvest[]> {
    return this.harvestService.findAllByProducer(+producerId);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.harvestService.remove(+id);
  }
} 