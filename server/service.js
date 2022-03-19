import fs from 'fs'
import { join, extname } from 'path'

import config from './config.js'

const { 
    dir: {
        publicDirectory
    }
} = config

export class Service{

    createFileStream(filename){
        return fs.createReadStream(filename)
    }

    async getFileInfo(file){
        const fullFilePath = join(publicDirectory, file)
        
        //Check if file exists
        await fs.promises.access(fullFilePath)

        const fileType = extname(fullFilePath)
    
        return {
            type: fileType,
            name: fullFilePath
        }
    }

    async getFileStream(file){
        const { name, type } = await this.getFileInfo(file)
        
        return {
            stream: this.createFileStream(name),
            type
        }
    }

}