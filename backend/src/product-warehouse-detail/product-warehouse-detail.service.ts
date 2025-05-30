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

  let detail: ProductWarehouseDetail;

  const existingDetail = await this.detailRepo.findOne({
    where: {
      product: { id: data.product.id },
      warehouse: { id: data.warehouse.id },
    },
    relations: ['product', 'warehouse'],
  });

  if (existingDetail) {
    existingDetail.stock += data.stock;
    detail = existingDetail;
  } else {
    detail = this.detailRepo.create(data);
  }

  await this.detailRepo.save(detail);

  warehouse.capacity -= data.stock;
  product.stock -= data.stock;

  await warehouseRepo.save(warehouse);
  await productRepo.save(product);

  return detail;
}



  async update(id: number, data: Partial<ProductWarehouseDetail>): Promise<ProductWarehouseDetail> {
    const detail = await this.findOne(id);

    const warehouseRepo = this.dataSource.getRepository(Warehouse);
    const productRepo = this.dataSource.getRepository(Product);

    const warehouse = await warehouseRepo.findOneBy({ id: detail.warehouse.id });
    const product = await productRepo.findOneBy({ id: detail.product.id });

    if (!warehouse || !product) {
      throw new NotFoundException('Producto o almacén no encontrado');
    }

    // Restaurar valores previos
    warehouse.capacity += detail.stock;
    product.stock += detail.stock;

    if (data.stock !== undefined) {
      if (warehouse.capacity < data.stock) {
        throw new BadRequestException('No hay suficiente capacidad disponible en el almacén');
      }
      if (product.stock < data.stock) {
        throw new BadRequestException('No hay suficiente stock disponible del producto');
      }

      warehouse.capacity -= data.stock;
      product.stock -= data.stock;
    }

    this.detailRepo.merge(detail, data);
    await warehouseRepo.save(warehouse);
    await productRepo.save(product);
    return this.detailRepo.save(detail);
  }

  async delete(id: number): Promise<void> {
    const detail = await this.findOne(id);

    const warehouseRepo = this.dataSource.getRepository(Warehouse);
    const productRepo = this.dataSource.getRepository(Product);

    const warehouse = await warehouseRepo.findOneBy({ id: detail.warehouse.id });
    const product = await productRepo.findOneBy({ id: detail.product.id });

    if (warehouse) {
      warehouse.capacity += detail.stock;
      await warehouseRepo.save(warehouse);
    }

    if (product) {
      product.stock += detail.stock;
      await productRepo.save(product);
    }

    await this.detailRepo.remove(detail);
  }
}
