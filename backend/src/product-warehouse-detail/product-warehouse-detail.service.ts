import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProductWarehouseDetail } from './entities/product-warehouse-detail.entity';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ProductWarehouseDetailService {
  constructor(
    @InjectRepository(ProductWarehouseDetail)
    private readonly detailRepo: Repository<ProductWarehouseDetail>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<ProductWarehouseDetail[]> {
    return this.detailRepo.find({ relations: ['product', 'warehouse'] });
  }

  async findOne(id: number): Promise<ProductWarehouseDetail> {
    const detail = await this.detailRepo.findOne({ where: { id }, relations: ['product', 'warehouse'] });
    if (!detail) throw new NotFoundException(`Detalle ${id} no encontrado`);
    return detail;
  }

  async create(data: Partial<ProductWarehouseDetail>): Promise<ProductWarehouseDetail> {
    const detail = this.detailRepo.create(data);

    if (!data.warehouse?.id || !data.product?.id || !data.stock) {
      throw new BadRequestException('warehouse.id, product.id y stock son obligatorios');
    }

    const warehouseRepo = this.dataSource.getRepository(Warehouse);
    const productRepo = this.dataSource.getRepository(Product);

    const warehouse = await warehouseRepo.findOneBy({ id: data.warehouse.id });
    const product = await productRepo.findOneBy({ id: data.product.id });

    if (!warehouse) throw new NotFoundException('Almacén no encontrado');
    if (!product) throw new NotFoundException('Producto no encontrado');

    if (warehouse.capacity < data.stock) {
      throw new BadRequestException('No hay suficiente capacidad disponible en el almacén');
    }
    if (product.stock < data.stock) {
      throw new BadRequestException('No hay suficiente stock disponible del producto');
    }

    // Actualizar capacidad del almacén
    warehouse.capacity -= data.stock;
    await warehouseRepo.save(warehouse);

    // Actualizar stock del producto
    product.stock -= data.stock;
    await productRepo.save(product);

    return this.detailRepo.save(detail);
  }

  async update(id: number, data: Partial<ProductWarehouseDetail>): Promise<ProductWarehouseDetail> {
    const detail = await this.findOne(id);
    this.detailRepo.merge(detail, data);
    return this.detailRepo.save(detail);
  }

  async delete(id: number): Promise<void> {
    const detail = await this.findOne(id);

    const productRepo = this.dataSource.getRepository(Product);

    // Restaurar capacidad del almacén
    if (detail.warehouse?.id && detail.stock) {
      const warehouseRepo = this.dataSource.getRepository(Warehouse);
      const warehouse = await warehouseRepo.findOneBy({ id: detail.warehouse.id });

      if (warehouse) {
        warehouse.capacity += detail.stock;
        await warehouseRepo.save(warehouse);
      }
    }
    if (detail.product?.id && detail.stock) {
      const productRepo = this.dataSource.getRepository(Product)
      const product = await productRepo.findOneBy({ id: detail.product.id });

      if (product) {
        product.stock += detail.stock;
        await productRepo.save(product);
      }
    }

    await this.detailRepo.remove(detail);
  }
}
