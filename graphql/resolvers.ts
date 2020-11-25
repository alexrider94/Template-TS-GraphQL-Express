import { mergeResolvers,loadFilesSync } from 'graphql-tools';
const path = require('path');


const resolversArray: any[] = loadFilesSync(path.join(__dirname, './resolvers'));

module.exports = mergeResolvers(resolversArray);