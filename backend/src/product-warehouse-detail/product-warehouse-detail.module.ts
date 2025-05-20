import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductWarehouseDetail } from './entities/product-warehouse-detail.entity';
import { ProductWarehouseDetailService } from './product-warehouse-detail.service';
import { ProductWarehouseDetailController } from './product-warehouse-detail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductWarehouseDetail])],
  providers: [ProductWarehouseDetailService],
  controllers: [ProductWarehouseDetailController],
})
export class ProductWarehouseDetailModule {}