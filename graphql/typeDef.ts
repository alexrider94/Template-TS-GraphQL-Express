const path = require('path');
import {loadFilesSync, mergeTypeDefs} from 'graphql-tools';

const typesArray:any[] = loadFilesSync(path.join(__dirname, './types'), {extensions: ['graphql']});

module.exports = mergeTypeDefs(typesArray);