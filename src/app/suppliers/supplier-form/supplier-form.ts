import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css',
})
export class SupplierForm implements OnInit, OnChanges {
  @Input() supplier: Supplier | null = null;
  @Input() isVisible = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<Supplier, 'id_supplier'>>();

  formData = {
    name: '',
    ruc: '',
    phone: '',
    address: '',
    tipo: '',
    status: 'Activo',
    company_name: '',
    contact_name: '',
    email: '',
  };

  tipos = ['Productor', 'Mayorista', 'Distribuidor', 'Exportador'];
  statuses = ['Activo', 'Inactivo'];

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplier'] && this.supplier) {
      this.loadSupplierDataToForm();
    }
  }

  loadSupplierDataToForm(): void {
    if (this.supplier) {
      this.formData = {
        name: this.supplier.name,
        ruc: this.supplier.ruc,
        phone: this.supplier.phone,
        address: this.supplier.address,
        tipo: this.supplier.tipo,
        status: this.supplier.status,
        company_name: this.supplier.company_name,
        contact_name: this.supplier.contact_name,
        email: this.supplier.email,
      };
    }
  }

  resetForm(): void {
    this.formData = {
      name: '',
      ruc: '',
      phone: '',
      address: '',
      tipo: '',
      status: 'Activo',
      company_name: '',
      contact_name: '',
      email: '',
    };
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const supplierData = {
        name: this.formData.name,
        ruc: this.formData.ruc,
        phone: this.formData.phone,
        address: this.formData.address,
        tipo: this.formData.tipo,
        status: this.formData.status,
        company_name: this.formData.company_name,
        contact_name: this.formData.contact_name,
        email: this.formData.email,
      };
      this.save.emit(supplierData);
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
      this.formData.name.trim() !== '' &&
      this.formData.company_name.trim() !== '' &&
      this.formData.ruc.trim() !== '' &&
      this.formData.email.trim() !== '' &&
      this.formData.phone.trim() !== ''
    );
  }

  formatDateForInput(date: Date): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
