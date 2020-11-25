const pathlib = require('path');
// const winston = require('winston');
import {} from 'winston-daily-rotate-file';
require('date-utils');
require('winston-daily-rotate-file');
import * as winston from 'winston';

export class Mylogger{
    protected logger: winston.Logger;
    protected option: winston.LoggerOptions;
    protected message: string;
    constructor(){
        this.option = {
            level: 'debug',
            format: winston.format.timestamp({
                format: "YYYY-MM--DD HH:mm:ss"
            }),
            transports: [
                new winston.transports.DailyRotateFile({
                    filename: pathlib.normalize('logs/access.log'), // log 폴더에 system.log 이름으로 저장
                    zippedArchive: false, // 압축여부
                    format: winston.format.printf(
                        info => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
                }),
                // 콘솔 출력
                new winston.transports.Console({
                    format: winston.format.printf(
                        info=> `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
                })
            ],
        };
        this.logger = winston.createLogger(this.option);
    }

    log(message:string){
        this.logger.info(message);
    }
}