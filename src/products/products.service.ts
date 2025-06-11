import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './products.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  private product: Product[] = [];

  insertProduct(title: string, desc: string, price: number) {
    const id = uuidv4();
    const newProduct = new Product(id, title, desc, price);
    this.product.push(newProduct);
    return id;
  }

  getProducts() {
    return this.product.map(({ id, title, description, price }) => ({
      id,
      title,
      description,
      price,
    }));
  }

  getProduct(prodId: string) {
    const product = this.product.find((prod) => prod.id === prodId);
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    const { id, title, description, price } = product;
    return { id, title, description, price };
  }

  updateProduct(
    prodId: string,
    productData: {
      title: string | null;
      description: string | null;
      price: number | null;
    },
  ) {
    const [product, index] = this.findProduct(prodId);
    const updatedProduct = {
      ...product,
      title:
        productData.title !== undefined && productData.title !== null
          ? productData.title
          : product.title,
      description:
        productData.description !== undefined &&
        productData.description !== null
          ? productData.description
          : product.description,
      price:
        productData.price !== undefined && productData.price !== null
          ? productData.price
          : product.price,
    };
    this.product[index] = { ...product, ...updatedProduct };
    return updatedProduct;
  }

  partialUpdate(
    prodId: string,
    productData: { title?: string; description?: string; price?: number },
  ) {
    const [product, index] = this.findProduct(prodId);
    const updatedProduct = {
      ...product,
      ...productData,
    };
    this.product[index] = updatedProduct;
    return updatedProduct;
  }

  deleteProduct(prodId: string) {
    const [product, index] = this.findProduct(prodId);
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    this.product.splice(index, 1);
    return product;
  }

  private findProduct(prodId: string): [Product, number] {
    const productIndex = this.product.findIndex((prod) => prod.id === prodId);
    if (productIndex === -1) {
      throw new NotFoundException('Could not find product.');
    }
    return [this.product[productIndex], productIndex];
  }
}
