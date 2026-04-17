import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ProductForm],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  providers: [ProductService],
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  filterStatus: 'todos' | 'activos' | 'inactivos' = 'todos';

  showForm = false;
  selectedProduct: Product | null = null;

  activeCount = 0;
  inactiveCount = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.applyFilters();
        this.updateCounts();
      },
      error: (error: unknown) => {
        console.error('Error cargando productos:', error);
      },
    });
  }

  updateCounts(): void {
    this.activeCount = this.products.filter((p) => p.estado === 'Activo').length;
    this.inactiveCount = this.products.filter((p) => p.estado === 'Inactivo').length;
  }

  applyFilters(): void {
    let filtered = this.products;

    if (this.filterStatus === 'activos') {
      filtered = filtered.filter((p) => p.estado === 'Activo');
    } else if (this.filterStatus === 'inactivos') {
      filtered = filtered.filter((p) => p.estado === 'Inactivo');
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
        p.nombreProducto.toLowerCase().includes(term)
      );
    }

    this.filteredProducts = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(status: 'todos' | 'activos' | 'inactivos'): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  openNewProductForm(): void {
    this.selectedProduct = null;
    this.showForm = true;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.showForm = true;
  }

  onFormClose(): void {
    this.showForm = false;
    this.selectedProduct = null;
  }

  onFormSave(productData: Omit<Product, 'idProducto'>): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.idProducto, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.onFormClose();
        },
        error: (error: unknown) => {
          console.error('Error actualizando producto:', error);
          alert('Error al actualizar el producto');
        },
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.onFormClose();
        },
        error: (error: unknown) => {
          console.error('Error creando producto:', error);
          alert('Error al crear el producto');
        },
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('¿Eliminar este producto? Será marcado como inactivo.')) {
      this.productService.eliminarProducto(id).subscribe({
        next: () => this.loadProducts(),
        error: (error: unknown) => {
          console.error('Error eliminando producto:', error);
          alert('Error al eliminar el producto');
        },
      });
    }
  }

  restoreProduct(id: number): void {
    if (confirm('¿Restaurar este producto?')) {
      this.productService.restaurarProducto(id).subscribe({
        next: () => this.loadProducts(),
        error: (error: unknown) => {
          console.error('Error restaurando producto:', error);
          alert('Error al restaurar el producto');
        },
      });
    }
  }
}