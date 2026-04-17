export interface Customer {
  idCustomer?: number;
  nameCustomer: string;
  lastnameCustomer: string;
  typeCustomer: string;
  phone: string;
  address: string;
  email: string;
  idUbigeo: string;
  documentType: string;
  documentNumber: string;
  status?: string; // "ACTIVO" | "INACTIVO"
}