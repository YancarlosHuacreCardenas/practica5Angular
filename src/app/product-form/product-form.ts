import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Input() isVisible = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<Product, 'idProducto'>>();

  estadoActivo = true;

  formData = {
    nombreProducto: '',
    idCategoria: 0,
    precio: 0,
    unidadMedida: '',
    idProveedor: 0,
    stockDisponible: 0,
    estado: 'Activo',
  };

  unidades = ['Kg', 'g', 'L', 'mL', 'unidad', 'caja', 'bolsa', 'saco'];

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.loadData();
    } else if (changes['product'] && !this.product) {
      this.resetForm();
    }
  }

  loadData(): void {
    if (this.product) {
      this.formData = {
        nombreProducto: this.product.nombreProducto,
        idCategoria: this.product.idCategoria,
        precio: this.product.precio,
        unidadMedida: this.product.unidadMedida,
        idProveedor: this.product.idProveedor,
        stockDisponible: this.product.stockDisponible,
        estado: this.product.estado,
      };
      this.estadoActivo = this.product.estado === 'Activo';
    }
  }

  resetForm(): void {
    this.formData = {
      nombreProducto: '',
      idCategoria: 0,
      precio: 0,
      unidadMedida: '',
      idProveedor: 0,
      stockDisponible: 0,
      estado: 'Activo',
    };
    this.estadoActivo = true;
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const productData: Omit<Product, 'idProducto'> = {
        ...this.formData,
        estado: this.estadoActivo ? 'Activo' : 'Inactivo',
      };
      this.save.emit(productData);
      this.resetForm();
      this.close.emit();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.close.emit();
  }

  isFormValid(): boolean {
    return (
      this.formData.nombreProducto.trim() !== '' &&
      this.formData.idCategoria > 0 &&
      this.formData.precio > 0 &&
      this.formData.unidadMedida.trim() !== '' &&
      this.formData.idProveedor > 0 &&
      this.formData.stockDisponible >= 0
    );
  }
}