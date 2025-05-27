// products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductWarehouseDetail } from 'src/product-warehouse-detail/entities/product-warehouse-detail.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatedProduct = this.productRepo.merge(product, data);
    return this.productRepo.save(updatedProduct);
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepo.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`); 
    }
    const productWarehouseRepo = this.dataSource.getRepository(ProductWarehouseDetail);
    const details = await productWarehouseRepo.find({ where: { product: { id } } });
    if (details.length > 0) {
      productWarehouseRepo.delete(details.map(detail => detail.id));
    }
    await this.productRepo.delete(id);
  }

}
