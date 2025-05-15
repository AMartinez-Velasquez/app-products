import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepo: Repository<Warehouse>,
  ) {}

  findAll(): Promise<Warehouse[]> {
    return this.warehouseRepo.find();
  }

  async findOne(id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepo.findOneBy({ id });
    if (!warehouse) throw new NotFoundException(`Warehouse ${id} not found`);
    return warehouse;
  }

  create(data: Partial<Warehouse>): Promise<Warehouse> {
    const warehouse = this.warehouseRepo.create(data);
    return this.warehouseRepo.save(warehouse);
  }

  async update(id: number, data: Partial<Warehouse>): Promise<Warehouse> {
    const warehouse = await this.findOne(id);
    this.warehouseRepo.merge(warehouse, data);
    return this.warehouseRepo.save(warehouse);
  }

  async delete(id: number): Promise<void> {
    const warehouse = await this.findOne(id);
    await this.warehouseRepo.remove(warehouse);
  }
}
