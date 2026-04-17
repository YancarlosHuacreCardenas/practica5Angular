import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  // URL corregida: /api/customer (como esta en tu backend)
  private apiUrl = 'http://3.86.121.47:8085/api/customer';

  private customersSubject = new BehaviorSubject<Customer[]>([]);
  public customers$ = this.customersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCustomers();
  }

  // Cargar todos los clientes - GET /api/customer
  loadCustomers(): void {
    this.http.get<Customer[]>(this.apiUrl).pipe(
      tap(customers => this.customersSubject.next(customers)),
      catchError(error => {
        console.error('Error loading customers:', error);
        return of([]);
      })
    ).subscribe();
  }

  // Obtener todos los clientes (observable)
  getCustomers(): Observable<Customer[]> {
    return this.customers$;
  }

  // Obtener clientes por estado - GET /api/customer/estado/{status}
  getCustomersByStatus(status: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/estado/${status}`);
  }

  // Obtener cliente por ID - GET /api/customer/{id}
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo cliente - POST /api/customer
  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer).pipe(
      tap(() => this.loadCustomers()),
      catchError(error => {
        console.error('Error adding customer:', error);
        throw error;
      })
    );
  }

  // Actualizar cliente - PUT /api/customer/{id}
  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer).pipe(
      tap(() => this.loadCustomers()),
      catchError(error => {
        console.error('Error updating customer:', error);
        throw error;
      })
    );
  }

  // Eliminar logico - PATCH /api/customer/eliminar/{id}
  deleteCustomer(id: number): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/eliminar/${id}`, {}).pipe(
      tap(() => this.loadCustomers()),
      catchError(error => {
        console.error('Error deleting customer:', error);
        throw error;
      })
    );
  }

  // Restaurar cliente - PATCH /api/customer/restaurar/{id}
  restoreCustomer(id: number): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/restaurar/${id}`, {}).pipe(
      tap(() => this.loadCustomers()),
      catchError(error => {
        console.error('Error restoring customer:', error);
        throw error;
      })
    );
  }

  // Helpers para contar activos/inactivos
  getActiveCustomers(): Customer[] {
    return this.customersSubject.value.filter(c => c.status === 'ACTIVO');
  }

  getInactiveCustomers(): Customer[] {
    return this.customersSubject.value.filter(c => c.status === 'INACTIVO');
  }
}