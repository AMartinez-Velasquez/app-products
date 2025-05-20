import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { WarehouseModule } from './warehouse/warehouse.module';
import { Warehouse } from './warehouse/entities/warehouse.entity';
import { ProductWarehouseDetail } from './product-warehouse-detail/entities/product-warehouse-detail.entity';
import { ProductWarehouseDetailModule } from './product-warehouse-detail/product-warehouse-detail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'product_db',
      entities: [Product, Warehouse, ProductWarehouseDetail],
      synchronize: true, // Deshabilitamos la sincronización automática
    }),
    ProductsModule,
    WarehouseModule,
    ProductWarehouseDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
