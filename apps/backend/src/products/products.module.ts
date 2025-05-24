import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [PassportModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
