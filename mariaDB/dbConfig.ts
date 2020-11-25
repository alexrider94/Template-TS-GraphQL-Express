import 'dotenv/config';

export const connectionLimit: number= 10;
export const acquireTimeout: number= 600000;
export const waitForConnections: boolean= true;
export const host: string= process.env.DBSERVER || "localhost";
export const user: string= process.env.DBUSER || "root";
export const password: string= process.env.DBPW || "1234";
export const database: string= process.env.DBNAME || "test";
