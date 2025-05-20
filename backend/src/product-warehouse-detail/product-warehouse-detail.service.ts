
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductWarehouseDetail } from './entities/product-warehouse-detail.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductWarehouseDetailService {
  constructor(
    @InjectRepository(ProductWarehouseDetail)
    private readonly detailRepo: Repository<ProductWarehouseDetail>,
  ) {}

  findAll(): Promise<ProductWarehouseDetail[]> {
    return this.detailRepo.find();
  }

  async findOne(id: number): Promise<ProductWarehouseDetail> {
    const detail = await this.detailRepo.findOneBy({ id });
    if (!detail) throw new NotFoundException(`Detalle ${id} no encontrado`);
    return detail;
  }

  create(data: Partial<ProductWarehouseDetail>): Promise<ProductWarehouseDetail> {
    const detail = this.det.create(data);
    return this.detailRepo.save(detail);
  }

  async update(id: number, data: Partial<ProductWarehouseDetail>): Promise<ProductWarehouseDetail> {
    const detail = await this.findOne(id);
    this.detailRepo.merge(detail, data);
    return this.detailRepo.save(detail);
  }

  async delete(id: number): Promise<void> {
    const detail = await this.findOne(id);
    await this.detailRepo.remove(detail);
  }
}