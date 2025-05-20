import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductWarehouseDetailService } from './product-warehouse-detail.service';
import { ProductWarehouseDetail } from './entities/product-warehouse-detail.entity';

@Controller('product-warehouse-detail')
export class ProductWarehouseDetailController {
  constructor(private readonly service: ProductWarehouseDetailService) {}

  @Get()
  findAll(): Promise<ProductWarehouseDetail[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductWarehouseDetail> {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() data: Partial<ProductWarehouseDetail>): Promise<ProductWarehouseDetail> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<ProductWarehouseDetail>): Promise<ProductWarehouseDetail> {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(Number(id));
  }
}
