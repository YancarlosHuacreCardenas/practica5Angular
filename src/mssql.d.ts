declare module 'mssql' {
  interface ConnectionConfig {
    authentication?: {
      type: string;
      options: {
        userName: string;
        password: string;
      };
    };
    server: string;
    port: number;
    database: string;
    options: {
      encrypt: boolean;
      trustServerCertificate: boolean;
      connectionTimeout: number;
    };
  }

  interface Recordset extends Array<any> {
    [key: string]: any;
  }

  interface IResult<T> {
    recordset: T[];
    recordsets: Recordset[];
    rowsAffected: number[];
  }

  interface Request {
    input(name: string, type: any, value: any): Request;
    query(sql: string): Promise<IResult<any>>;
  }

  class ConnectionPool {
    constructor(config: ConnectionConfig);
    connect(): Promise<void>;
    request(): Request;
  }

  export const Int: any;
  export const VarChar: any;
  export const Char: any;
}
