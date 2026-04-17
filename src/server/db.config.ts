import sql from 'mssql';

export const sqlConfig = {
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: 'Admin12345!',
    },
  },
  server: 'localhost',
  port: 1433,
  database: 'AgroPacayales',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 30000,
  },
};

// Pool de conexión
export let pool: sql.ConnectionPool;

export async function initializePool() {
  try {
    pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    console.log('✓ Conexión a SQL Server exitosa');
  } catch (error) {
    console.error('✗ Error conectando a SQL Server:', error);
    throw error;
  }
}
