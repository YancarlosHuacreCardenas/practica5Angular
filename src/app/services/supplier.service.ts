import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { Supplier } from '../models/supplier.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private apiUrl = `${environment.apiUrl}/suppliers`;
  private suppliers: Supplier[] = [
    {
      id_supplier: 1,
      name: 'Proveedor Andino',
      ruc: '10123456789',
      phone: '900111222',
      address: 'Av Andes 101 - Cusco',
      tipo: 'Productor',
      status: 'Activo',
      company_name: 'Andes Food SAC',
      contact_name: 'Luis Quispe',
      email: 'luis@andesfood.com',
    },
    {
      id_supplier: 2,
      name: 'Proveedor Costero',
      ruc: '10234567890',
      phone: '901222333',
      address: 'Av Costanera 202 - Lima',
      tipo: 'Mayorista',
      status: 'Activo',
      company_name: 'CostaMar SAC',
      contact_name: 'Ana Torres',
      email: 'ana@costamar.com',
    },
  ];

  private suppliersSubject = new BehaviorSubject<Supplier[]>(this.suppliers);
  public suppliers$ = this.suppliersSubject.asObservable();

  constructor(private http: HttpClient) {
    if (!environment.useLocalData) {
      this.loadSuppliersFromApi();
    }
  }

  private loadSuppliersFromApi(): void {
    this.http.get<Supplier[]>(this.apiUrl).pipe(
      tap(suppliers => {
        this.suppliers = suppliers;
        this.suppliersSubject.next([...this.suppliers]);
      }),
      catchError(error => {
        console.error('Error loading suppliers from API:', error);
        return of([]);
      })
    ).subscribe();
  }

  // Obtener todos los proveedores
  getSuppliers(): Observable<Supplier[]> {
    return this.suppliers$;
  }

  // Obtener solo proveedores activos
  getActiveSuppliers(): Supplier[] {
    return this.suppliers.filter((s) => s.status === 'Activo');
  }

  // Obtener solo proveedores inactivos
  getInactiveSuppliers(): Supplier[] {
    return this.suppliers.filter((s) => s.status === 'Inactivo');
  }

  // Obtener proveedor por ID
  getSupplierById(id: number): Supplier | undefined {
    return this.suppliers.find((s) => s.id_supplier === id);
  }

  // Crear nuevo proveedor
  addSupplier(supplier: Omit<Supplier, 'id_supplier'>): Observable<Supplier> {
    if (environment.useLocalData) {
      const newSupplier: Supplier = {
        id_supplier: Math.max(...this.suppliers.map(s => s.id_supplier), 0) + 1,
        ...supplier,
      };
      this.suppliers.push(newSupplier);
      this.suppliersSubject.next([...this.suppliers]);
      return of(newSupplier);
    } else {
      return this.http.post<Supplier>(this.apiUrl, supplier).pipe(
        tap(newSupplier => {
          this.suppliers.push(newSupplier);
          this.suppliersSubject.next([...this.suppliers]);
        }),
        catchError(error => {
          console.error('Error adding supplier:', error);
          throw error;
        })
      );
    }
  }

  // Actualizar proveedor
  updateSupplier(id: number, updatedData: Partial<Supplier>): Observable<Supplier> {
    if (environment.useLocalData) {
      const index = this.suppliers.findIndex((s) => s.id_supplier === id);
      if (index !== -1) {
        this.suppliers[index] = { ...this.suppliers[index], ...updatedData };
        this.suppliersSubject.next([...this.suppliers]);
        return of(this.suppliers[index]);
      }
      return of({} as Supplier);
    } else {
      return this.http.put<Supplier>(`${this.apiUrl}/${id}`, updatedData).pipe(
        tap(updatedSupplier => {
          const index = this.suppliers.findIndex((s) => s.id_supplier === id);
          if (index !== -1) {
            this.suppliers[index] = updatedSupplier;
            this.suppliersSubject.next([...this.suppliers]);
          }
        }),
        catchError(error => {
          console.error('Error updating supplier:', error);
          throw error;
        })
      );
    }
  }

  // Eliminar proveedor (cambiar estado a Inactivo - soft delete)
  deleteSupplier(id: number): Observable<any> {
    return this.updateSupplier(id, { status: 'Inactivo' });
  }

  // Restaurar proveedor (cambiar estado a Activo)
  restoreSupplier(id: number): Observable<Supplier> {
    return this.updateSupplier(id, { status: 'Activo' });
  }
}
