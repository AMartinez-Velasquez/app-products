import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';0
import { OneToMany } from 'typeorm';
import { ProductWarehouseDetail } from '../../product-warehouse-detail/entities/product-warehouse-detail.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ProductWarehouseDetail, detail => detail.product)
  details: ProductWarehouseDetail[];
}
