import * as Dataloader from 'dataloader';
import {MariaDB} from '../../mariaDB/dbConnection';
import {Mylogger} from '../../log/logger';
import * as exe from '../../mariaDB/dbExe';

const DB = new MariaDB();
const logger = new Mylogger();

export const getCompanyNoExeLoader:Dataloader<any,any,any> = new Dataloader(async (companyNo: any[]) => {
    let result: any[]= [];
    try {
        const conn = await DB.getPoolConnection();
       
        //logger.log(`you got ${companyNo}`)
        const results: object[]= await exe.getCompanyNoExe(conn,companyNo);
        if(conn) await DB.endPoolConnection(conn);
        //logger.log(`what you got here :  ${JSON.stringify(results)}`);

        await companyNo.map( no => {
            results.forEach((data:any)=> {
                let dataNo = data["no"]
                if( dataNo == no) {
                    result.push(data);
                }
            });
        });
        
        return result;    
    } catch (error) {
        logger.log(`getCompanyNoExeLoader error ${error}`);
        throw new Error("getCompanyNoExeLoader error");
    } 
},{cache:false});

export const getEmailExeLoader:Dataloader<any,any,any> = new Dataloader(async (email: any[]) => {
    let result: any[]= [];
    try {
        const conn = await DB.getPoolConnection();
       
        // logger.log(`you got ${email}`)
        const results: object[]= await exe.getEmailExe(conn,email);
        if(conn) await DB.endPoolConnection(conn);
        //logger.log(`what you got here :  ${JSON.stringify(results)}`);

        await email.map( no => {
            results.forEach((data:any)=> {
                let dataNo = data["email"]
                if( dataNo == no) {
                    result.push(data);
                }
            });
        });
        
        return result;    
    } catch (error) {
        logger.log(`getEmailExeLoader error ${error}`);
        throw new Error("getEmailExeLoader error");
    } 
},{cache:false});

 
 