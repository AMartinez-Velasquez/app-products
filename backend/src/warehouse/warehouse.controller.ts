import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  findAll(): Promise<Warehouse[]> {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Warehouse> {
    return this.warehouseService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehouseService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehouseService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.warehouseService.delete(Number(id));
  }
}