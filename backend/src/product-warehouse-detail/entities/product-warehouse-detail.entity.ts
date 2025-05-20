import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Product } from '../../products/entities/product.entity';
  import { Warehouse } from '../../warehouse/entities/warehouse.entity';
  
  @Entity()
  export class ProductWarehouseDetail {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;
  
    @ManyToOne(() => Warehouse, { eager: true })
    @JoinColumn({ name: 'warehouseId' })
    warehouse: Warehouse;
  
    @Column('int')
    stock: number;
  }
  