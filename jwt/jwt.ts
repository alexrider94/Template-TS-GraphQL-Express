import * as jwt from 'jsonwebtoken';
import { Mylogger } from '../log/logger';
import * as mariaDB from 'mariadb';
import * as exe from '../mariaDB/dbExe';
import * as crypto from '../jwt/crypto';
import * as Query from '../mariadb/dbQuery';
import { String } from 'aws-sdk/clients/apigateway';

const logger = new Mylogger();
const APP_SECRET:string = "jWt_(An@d-rAnDO_meS!alt";


/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @param {string} email 유저아이디
* @param {string} password 비밀번호
* @return {{token}} token값
* @api public 로그인 유저
*/

export async function loginUserExe(conn:mariaDB.Connection, email:string, password:string){
    try {
        const result: any = await conn.query(Query.loginUser,email); // []형태
        //shift()로 배열첫번째요소 제거하고 반환.
        // logger.log(`login result : ${result.length}`);
        // logger.log(`login result 2: ${JSON.stringify(result)}`);
        if(result.length > 0){
            const DBpassword:string = result[0].password;
            const salt:string = result[0].salt;
      
            const inputpassword = await crypto.encryptPassword(password,salt);
            
            // 비번 체크
            if(DBpassword === inputpassword.password) {
                const token = jwt.sign({
                    email: result[0].email
                }, APP_SECRET)

                //로그인 활성화 체크
                if(result[0].loginCheck === 0){
                    throw new Error('ID Inactive')
                }
                else{
                    return {
                        token
                    }
                }
            }
            else {
                throw new Error('wrong password');
            }
        }
        else throw new Error('no user email founded');
    } catch (error) {
        logger.log(`loginUserExe error ${error}`);
        throw error;
    }
} 

/**
* @param {mariaDB.Connection} conn 디비 커넥션
* @param {string} companyNo 회사번호
* @param {string} email 아이디
* @param {string} password 비밀번호
* @param {string} name 사용자이름
* @param {string} contact 연락처
* @param {string} department 부서
* @param {string} position 직책
* @param {string} role 역할
* @param {string} status 근무상태
* @return {Promise<{string}>} token값
* @api public 로그인 유저
*/

export async function signUpUserExe(
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
    ):Promise<{token:string}>{
    try {
        const result = await exe.insertUserExe(
            conn,
            companyNo,
            email,
            password,
            name,
            contact,
            department,
            position,
            status,
            role
            );

        /////////////////////////////////////////////////////
        const userResult = await exe.findUserExe(conn,email);

        // console.log("userResult "+ JSON.stringify(userResult));
        const user = userResult.shift();

        const token:any = jwt.sign({
            userId: user.userId
        }, APP_SECRET);

        return {
            token
        }

    } catch (error) {
        logger.log(`signUpUserExe error ${error}`);
        throw error;
    }
} 