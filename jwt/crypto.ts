import * as crypto from 'crypto';
import {Mylogger} from '../log/logger';

const logger = new Mylogger();

/**
* @param {Number} byteSize 기본값 16
* @param {Function} callback
* @return {String}
* @api public 솔트생성
*/

function makeSalt(byteSize: number): string {
    const defaultByteSize: number = 16;

    if (byteSize < 1) {
        byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize).toString('hex');

}

/**
* @param {String} password hashed된 비밀번호
* @param {String} mySalt 솔트값
* @param {Function} callback
* @return {Obejct}
* @api public 단방향 - SHA512
*/

export function encryptPassword(password: string, mySalt?:string): {password:string,salt:string} {   
    const salt = makeSalt(0);
          
    const defaultIterations: number = 1000;
    const defaultKeyLength: number = 64;

    const saltedValue: string = Buffer.alloc(24,  salt, 'base64').toString('hex');

    return mySalt ? {
        password: crypto.pbkdf2Sync(password, mySalt, defaultIterations, defaultKeyLength, 'sha512').toString('hex'),
        salt: mySalt
    }
    :
    {
        password: crypto.pbkdf2Sync(password, saltedValue, defaultIterations, defaultKeyLength, 'sha512').toString('hex'),
        salt: saltedValue
    };
}



/**
* @param {String} data 중요데이터
* @param {String} key 키 32byte
* @param {Function} callback
* @return {string} 
* @api public 양방향 - AES256 암호화 
*/

/* 
    Block cipher mode (블록암호 운용방식) : CBC - 초기화벡터 + XOR
*/
export function encryptData(key:string,data: string): string {
    try {
        const keyToByte: Buffer = Buffer.from(key,'utf-8'); // 32byte

        const iv : Buffer = Buffer.from(key.slice(0,16)); //16 byte
        //첫블럭과 XOR연산을 위해 vector Initialization vectors should be unpredictable and unique

        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            keyToByte,
            iv 
        );
    
        let encrypted = cipher.update(data,'utf8','base64');
        encrypted += cipher.final('base64');
    
        return encrypted;        
    } catch (error) {
        logger.log(`encryptData error: ${error}`);
        throw error;
    }
}

/**
* @param {String} encryptedData 중요데이터 
* @param {String} key 키 32BYTE
* @param {Function} callback
* @return {string} 
* @api public 양방향 - AES 256 복호화
*/

export function decryptData(key:string, encryptedData: string): string {
    try {
        const keyToByte: Buffer = Buffer.from(key,'utf-8');
        const iv : Buffer = Buffer.from(key.slice(0,16)); 
    
        const decipher = crypto.createDecipheriv('aes-256-cbc',keyToByte,iv);

        let decrypted = decipher.update(encryptedData,'base64','utf8');
        decrypted += decipher.final('utf8');

        return decrypted;        
    } catch (error) {
        logger.log(`decryptData error: ${error}`);
        throw error;
    }
}
