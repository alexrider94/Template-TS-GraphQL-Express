import { Application } from "express";
import { createServer, Server } from 'http';
import schema from './graphql/schema';
import * as cors from 'cors';
import * as compression from 'compression';
import 'dotenv/config';
import {Mylogger} from './log/logger';
import * as os from 'os';
import { ApolloServer } from 'apollo-server-express';

class App {
    protected app: Application;
    protected server: ApolloServer;
    protected httpServer: Server;

    constructor(PORT: number | string){
        const numberOfCores:number = os.cpus().length;
        const logger = new Mylogger();

        this.server = new ApolloServer({
            schema,
        })

        this.app = require('express')();
        this.app.use(cors());
        this.app.use(compression());;
       
        this.server.applyMiddleware({app:this.app,path:'/graphql'});

        this.httpServer = createServer(this.app);
        
        this.httpServer.listen(PORT,()=>{
            logger.log(`server started on http://localhost:${PORT}`);
            logger.log(`graphql test web started on http://localhost:${PORT}/graphql`);  
        })
    }
}

new App(process.env.PORT);