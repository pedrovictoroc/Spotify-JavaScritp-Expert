import { jest, expect, describe, test, beforeEach } from '@jest/globals'

import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
import { Controller } from '../../../server/controller.js'


describe('#Controller - test site for controller response', () => {
    beforeEach(() =>{
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
  
    test('#GetFileStream', async () => {
        const mockStream = TestUtil.generateReadableStream(['test'])
        const mockType = '.html'
        const mockFileName = 'test.html'
    
        jest.spyOn(
          Service.prototype,
          Service.prototype.getFileStream.name,
        ).mockResolvedValue({
          stream: mockStream,
          type: mockType
        })
    
        const controller = new Controller()
        const {
          stream,
          type
        } = await controller.getFileStream(mockFileName)
    
        expect(stream).toStrictEqual(mockStream)
        expect(type).toStrictEqual(mockType)
    })

})