import * as mariaDB from 'mariadb';
import { Mylogger } from '../log/logger';
import {
    connectionLimit,
    acquireTimeout,
    host,
    user,
    password,
    database
} from './dbConfig';

const poolOption: mariaDB.PoolConfig = {
    connectionLimit: connectionLimit,
    acquireTimeout: acquireTimeout,
    host: host,
    user: user,
    password: password,
    database: database
}

export class MariaDB {
    protected pool: mariaDB.Pool;
    protected logger: Mylogger = new Mylogger();

    constructor(){
        try {
            this.pool = mariaDB.createPool(poolOption);
        } catch (error) {
            this.logger.log(`createPool is error ${error}`);
            throw error;
        }
    }

    // async exeTransaction(queryList:string[]): Promise<any[]> {
    //     let conn: mariaDB.Connection;
    //     try {
    //         let results:any[] = [];
    //         await conn.beginTransaction();

    //         await queryList.map((query)=>{
    //             this.logger.log(`query is ${query}`);
    //             results.push(conn.query(query));
    //         })

    //         await conn.commit();

    //         return results;
    //     } catch (error) {
    //         this.logger.log(`beginTransaction error ${error}`);
    //         throw error;
    //     }
    // }

    async getPoolConnection (): Promise<mariaDB.Connection> {
        let conn: mariaDB.Connection;
        try {
            conn = await this.pool.getConnection();
            this.logger.log(`connected ! connedtion id : ${conn.threadId}`);
            return conn;
        } catch (error) {
            this.logger.log(`getPoolConnection error ${error}`);
            throw error;
        }
    }

    async endPoolConnection (conn:mariaDB.Connection): Promise<void> {
        try {
            if(conn) {
                await conn.end();
                this.logger.log(`disconnected! connection id : ${conn.threadId}`);
                return;
            }
        } catch (error) {
            this.logger.log(`endPoolConnection : ${error}`);
            throw error;
        }
    }
} 