import fs from 'fs'
import { jest, expect, describe, test, beforeEach } from '@jest/globals'

import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
import config  from '../../../server/config.js'

const {
  dir: {
    publicDirectory
  }
} = config

describe('#Service - test site for core processing', () => {
    beforeEach(() =>{
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
  
    test('#CreateFileStream', () => {
      const currentReadable = TestUtil.generateReadableStream(['test'])

      jest.spyOn(
        fs,
        fs.createReadStream.name
      ).mockReturnValue(currentReadable)

      const service = new Service()
      const file = 'file.mp3'

      const result = service.createFileStream(file)

      expect(result).toStrictEqual(currentReadable)
      expect(fs.createReadStream).toHaveBeenCalledWith(file)
    })

    test('#GetFileInfo', async () => {
      jest.spyOn(
        fs.promises,
        fs.promises.access.name
      ).mockResolvedValue()
  
      const file = 'conversation.mp3'
      const service = new Service()
      const result = await service.getFileInfo(file)
      const expectedResult = {  
        type: '.mp3',
        name: `${publicDirectory}\\${file}`
      }
  
      expect(result).toStrictEqual(expectedResult)
    })

    test('#GetFileStream', async () => {
      const currentReadable = TestUtil.generateReadableStream(['abc'])
      const file = `mySong.mp3`
      const currentSongFullPath = `${publicDirectory}/${file}`
  
      const fileInfo = {
        type: '.mp3',
        name: currentSongFullPath
      }
  
      const service = new Service()
      jest
        .spyOn(
          service,
          service.getFileInfo.name
        )
        .mockResolvedValue(fileInfo)
  
      jest
        .spyOn(
          service,
          service.createFileStream.name
        )
        .mockReturnValue(currentReadable)
  
      const result = await service.getFileStream(file)
      const expectedResult = {
        type: fileInfo.type,
        stream: currentReadable
      }
      expect(result).toStrictEqual(expectedResult)
      expect(service.createFileStream).toHaveBeenCalledWith(fileInfo.name)
      expect(service.getFileInfo).toHaveBeenCalledWith(file)
    })
})