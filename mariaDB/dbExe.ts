
import * as mariaDB from 'mariadb';
import * as crypto from '../jwt/crypto';
import * as Query from './dbQuery';
import {Mylogger} from '../log/logger';

const logger = new Mylogger();

/* 
SQL Injection 대응방안
1. Prepared Statement 구문사용
2. Error Message 노출 금지 
*/

/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @param {any[]} email 이메일
* @return {any[]} result
* @api public 이메일로 유저 정보 가져오는 API 
*/

export async function getEmailExe(
    conn:mariaDB.Connection,
    email:any[],
){
    try {
        let values:any[] = [];
        //console.log(`${projectNo}`)

        await email.map((val:any) => {
            values.push(val)
        });

        logger.log(`query is ${Query.getEmail}`);
        const result = await conn.query(Query.getEmail,[values]);
        return result;

    } catch (error) {
        logger.log(`getEmailExe error: ${error}`);
        throw new Error('getEmailExe error');
    }
}

/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @param {number} companyNo 회사번호
* @param {number} order 오름차순,내림차순
* @param {number} limit 몇개만 가져올지
* @param {number} offset 맨처음제외
* @return {any[]} result
* @api public 회사별 유저목록 가져오는 API (페이징)
*/

export async function getUserByCompanyNoPagingExe(
    conn:mariaDB.Connection,
    companyNo:number,
    order:string,
    limit:number,
    offset:number,
){
    try {
        logger.log(`query is ${Query.getUserByCompanyNoPaging}`);
        const result = await conn.query(Query.getUserByCompanyNoPaging("no",order), [companyNo,limit,offset]);
        return result;
    } catch (error) {
        logger.log(`getCompanyExe error: ${error}`);
        throw new Error('getCompanyExe error');
    }
}


/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @return {any[]} result
* @api public 모든 유저 가져오는 API
*/
export async function getAllUsersExe(
    conn:mariaDB.Connection,
){
    try {
        logger.log(`query is ${Query.getAllUsers}`);
        const result = await conn.query(Query.getAllUsers);
        return result;     
    } catch (error) {
        logger.log(`getAllUserExe error : ${error}`);
        throw new Error("getAllUserExe error");
    }
   
}


/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @param {number} CompanyNo 회사번호
* @param {string} email 아이디
* @param {string} password 비밀번호
* @param {string} name 사용자이름
* @param {string} contact 번호
* @param {string} department 부서
* @param {string} position 직급
* @param {string} status 상태
* @param {string} role 권한
* @return {any[]} result
* @api public 유저 업데이트 API
*/
export async function updateUserExe(
    conn:mariaDB.Connection,
    userNo:number,
    companyNo:number,
    email:string,
    name:string,
    contact:string,
    department:string,
    position:string,
    status:string,
    role:string
){
    try {
        logger.log(`query is ${Query.updateUser}`);
        const values = [companyNo,email,name,contact,department,position,status,role,userNo];
        const result = await conn.query(Query.updateUser,values);
        return result.affectedRows;     
    } catch (error) {
        logger.log(`updateUserExe error : ${error}`);
        throw new Error("updateUserExe error");
    }
   
}

/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @return {any[]} result
* @api public 회사의 유저 리스트 가져오는 API
*/
export async function getCompanyUsersExe(
    conn:mariaDB.Connection,
    companyNo:number
){
    try {
        logger.log(`query is ${Query.getCompanyUsers}`);
        const result = await conn.query(Query.getCompanyUsers,companyNo);
        return result;     
    } catch (error) {
        logger.log(`getCompanyUsersExe error : ${error}`);
        throw new Error("getCompanyUsersExe error");
    }
   
}

/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @return {any[]} result
* @api public 유저정보를 유저번호로 찾는 API
*/
export async function getUserByUserNoExe(
    conn:mariaDB.Connection,
    userNo:number
){
    try {
        logger.log(`query is ${Query.getUserByUserNo}`);
        const result = await conn.query(Query.getUserByUserNo,userNo);
        return result;     
    } catch (error) {
        logger.log(`getUserByUserNoExe error : ${error}`);
        throw new Error("getUserByUserNoExe error");
    }
   
}

/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @param {mariaDB.Connection} email 이메일
* @return {Promise<any>} result
* @api public 이메일로 유저 찾는 API
*/
export async function findUserExe(
    conn:mariaDB.Connection,
    email:string
    ):Promise<any>{
    try {
        logger.log(`query is ${Query.findUser}`);
        const result = await conn.query(Query.findUser, email);
        
        return result;
    } catch (error) {
        logger.log(`findUiserExe error : ${error}`);
        throw new Error("findUiserExe error");
    }
}

/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @param {number} CompanyNo 회사번호
* @param {string} email 아이디
* @param {string} password 비밀번호
* @param {string} name 사용자이름
* @param {string} contact 번호
* @param {string} department 부서
* @param {string} position 직급
* @param {string} status 상태
* @param {string} role 권한
* @return {Promise<any>} result
* @api public 유저 정보 생성하는 API
*/
export async function insertUserExe(
    conn:mariaDB.Connection,
    companyNo:number,
    email:string,
    password:string,
    name:string,
    contact:string,
    department:string,
    position:string,
    status:string,
    role:string
    ):Promise<any>{
    try {
        const EncryptedPW = crypto.encryptPassword(password);

        const queryValues:(string|number)[]= [companyNo,email,EncryptedPW.password,name,contact,department,position,status,EncryptedPW.salt,role];
        const result = await conn.query(Query.insertUser,queryValues);
        
        return result.affectedRows;
    } catch (error) {
        logger.log(`insertUserExe error : ${error}`);
        throw new Error("user exist");
    }
}


/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @param {number} userNo 유저번호
* @param {string} password 비밀번호
* @return {Promise<any>} result
* @api public 유저 비밀번호 갱신 API
*/
export async function updatePasswordExe(
    conn:mariaDB.Connection,
    userNo:number,
    password:string,
    ):Promise<any>{
    try {
        const EncryptedPW = crypto.encryptPassword(password);

        const queryValues:(string|number)[]= [EncryptedPW.password,EncryptedPW.salt,userNo];
        const result = await conn.query(Query.updatePassword,queryValues);
        
        return result.affectedRows;
    } catch (error) {
        logger.log(`updatePasswordExe error : ${error}`);
        throw new Error("updatePasswordExe error");
    }
}





