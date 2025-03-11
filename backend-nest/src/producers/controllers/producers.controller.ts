import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { ProducersService } from '../services/producers.service';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { Producer } from '../entities/producer.entity';

@Controller('produtores')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  create(@Body() createProducerDto: CreateProducerDto): Promise<Producer> {
    return this.producersService.create(createProducerDto);
  }

  @Get()
  findAll(): Promise<Producer[]> {
    return this.producersService.findAll();
  }

  @Get('dashboard')
  getDashboard() {
    return this.producersService.getDashboard();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Producer> {
    const producer = await this.producersService.findOne(+id);
    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${id} não encontrado`);
    }
    return producer;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProducerDto: UpdateProducerDto): Promise<Producer> {
    return this.producersService.update(+id, updateProducerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.producersService.remove(+id);
  }
} 