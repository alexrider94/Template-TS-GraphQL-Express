import {MariaDB} from '../../mariaDB/dbConnection';
import {Mylogger} from '../../log/logger';
import * as jwt from '../../jwt/jwt';
import * as exe from '../../mariaDB/dbExe';
import * as userDataLoader from '../loaders/userDataloader';

const DB = new MariaDB();
const logger = new Mylogger();

module.exports = {
    Query: {
        async getAllUsers(_: void, args:void){
            try {
                const conn = await DB.getPoolConnection();
                const result = await exe.getAllUsersExe(conn);

                if(conn) await DB.endPoolConnection(conn);
                return result;
            } catch (error) {
                logger.log(`getAllUser error : ${error}`);
                throw error;
            }
        },

        async updateUser(_: void, args:{
            userNo:number,
            companyNo:number,
            email:string,
            name:string,
            contact:string,
            department:string,
            position:string,
            status:string,
            role:string
        }){
            try {
                const conn = await DB.getPoolConnection();
                const result = await exe.updateUserExe(
                    conn,
                    args.userNo,
                    args.companyNo,
                    args.email,
                    args.name,
                    args.contact,
                    args.department,
                    args.position,
                    args.status,
                    args.role
                );

                if(conn) await DB.endPoolConnection(conn);
                return {count:result};
            } catch (error) {
                logger.log(`updateUserExe error : ${error}`);
                throw error;
            }
        },

        async getCompanyUsers(_: void, args:{
            companyNo:number
        }){
            try {
                const conn = await DB.getPoolConnection();
                const result = await exe.getCompanyUsersExe(conn,args.companyNo);

                if(conn) await DB.endPoolConnection(conn);
                return result;
            } catch (error) {
                logger.log(`getCompanyUsers error : ${error}`);
                throw error;
            }
        },

        async getUserByCompanyNoPaging(_: void, args:{
            companyNo:number
            order:string
            limit:number
            offset:number
        }) {
            try {
                const conn = await DB.getPoolConnection();
                const result = await exe.getUserByCompanyNoPagingExe(conn,args.companyNo,args.order,args.limit,args.offset);

                if(conn) await DB.endPoolConnection(conn);
                return result;
            } catch (error) {
                logger.log(`getUserByCompanyNoPaging error : ${error}`);
                throw error;
            }
        },

        async getUserByEmail(_: void, args: {
            email:string
        }){
            try {
                const conn = await DB.getPoolConnection();
                const result = await exe.findUserExe(conn,args.email);
                // console.log(JSON.stringify(result));

                if(conn) await DB.endPoolConnection(conn);
                return result[0];
            } catch (error) {
                logger.log(`findUser error : ${error}`);
                throw error;
            }
        },

        async loginUser(_: void, args: {
            email:string,
            password:string
        }){
            try {
                const conn = await DB.getPoolConnection();
                const result = await jwt.loginUserExe(conn,args.email,args.password);

                if(conn) await DB.endPoolConnection(conn);

                return result;
            } catch (error) {
                logger.log(`loginUserExe error : ${error}`);
                throw error;
            }
        },

        async updatePassword(_: void, args: {
            userNo:number,
            password:string
        }){
            try {
                const conn = await DB.getPoolConnection();
                const result = await exe.updatePasswordExe(conn,args.userNo,args.password);

                if(conn) await DB.endPoolConnection(conn);

                return result;
            } catch (error) {
                logger.log(`loginUserExe error : ${error}`);
                throw error;
            }
        },

        async signUpUser(_: void, args: {
            companyNo:number,
            email:string,
            password:string,
            name:string,
            contact:string,
            department:string,
            position:string,
            status:string,
            role:string
        }){
          try {
                const conn = await DB.getPoolConnection();
                const result = await jwt.signUpUserExe(
                    conn,
                    args.companyNo,
                    args.email,
                    args.password,
                    args.name,
                    args.contact,
                    args.department,
                    args.position,
                    args.status,
                    args.role
                );
                
                logger.log(`user sign up information is ${JSON.stringify(result)}`);
                if(conn) await DB.endPoolConnection(conn);
                return result;
          } catch (error) {
            logger.log(`signUpUser error : ${error}`);
            throw error;
          }  
        },

       async inviteProjectUserToSystemUser(
           _: void,
           args: {
               email:string,
           }
       ){
           try {
                /*  [초대링크 로직]
                    체크 해야하는 부분
                    1. 유저테이블에 유저가 이미 존재하는지
                */
                const conn = await DB.getPoolConnection();
                const result = "";

                if(conn) await DB.endPoolConnection(conn);
                return result;
           } catch (error) {
                logger.log(`inviteProjectUserToSystemUser`);
                throw error;
           }
       }
    },

    User: {
        async companyNo({companyNo}:{companyNo: string}){
            try {
                // logger.log(`what you got? ${JSON.stringify(companyNo)}`);
                const result = await userDataLoader.getCompanyNoExeLoader.load([companyNo]);
                return result;
            } catch (error) {
                logger.log(`companyNo error : ${error}`);
                throw error;
            }
        },

        async email({email}:{email:string}) {
            try {
                const result = await userDataLoader.getEmailExeLoader.load([email]);
                return result;
            } catch (error) {
                logger.log(`email error : ${error}`);
                throw error;
            }
        }
    }
}
