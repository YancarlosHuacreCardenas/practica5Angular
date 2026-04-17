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
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css',
})
export class CustomerForm implements OnInit, OnChanges {
  @Input() customer: Customer | null = null;
  @Input() isVisible = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Customer>();

  formData: Customer = {
    nameCustomer: '',
    lastnameCustomer: '',
    typeCustomer: '',
    phone: '',
    address: '',
    email: '',
    idUbigeo: '',
    documentType: '',
    documentNumber: '',
  };

  customerTypes = ['Natural', 'Juridico', 'Mayorista', 'Minorista'];
  documentTypes = ['DNI', 'RUC', 'Carnet de Extranjeria', 'Pasaporte'];

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible && this.customer) {
      this.loadCustomerDataToForm();
    } else if (changes['customer'] && this.isVisible && this.customer) {
      this.loadCustomerDataToForm();
    } else if (changes['isVisible'] && this.isVisible && !this.customer) {
      this.resetForm();
    }
  }

  loadCustomerDataToForm(): void {
    if (this.customer) {
      this.formData = {
        nameCustomer: this.customer.nameCustomer || '',
        lastnameCustomer: this.customer.lastnameCustomer || '',
        typeCustomer: this.customer.typeCustomer || '',
        phone: this.customer.phone || '',
        address: this.customer.address || '',
        email: this.customer.email || '',
        idUbigeo: this.customer.idUbigeo || '',
        documentType: this.customer.documentType || '',
        documentNumber: this.customer.documentNumber || '',
      };
    }
  }

  resetForm(): void {
    this.formData = {
      nameCustomer: '',
      lastnameCustomer: '',
      typeCustomer: '',
      phone: '',
      address: '',
      email: '',
      idUbigeo: '',
      documentType: '',
      documentNumber: '',
    };
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.save.emit(this.formData);
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
      this.formData.nameCustomer.trim() !== '' &&
      this.formData.lastnameCustomer.trim() !== '' &&
      this.formData.typeCustomer.trim() !== '' &&
      this.formData.phone.trim() !== '' &&
      this.formData.email.trim() !== '' &&
      this.formData.documentType.trim() !== '' &&
      this.formData.documentNumber.trim() !== ''
    );
  }
}