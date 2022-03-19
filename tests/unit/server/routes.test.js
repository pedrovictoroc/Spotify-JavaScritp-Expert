import { jest, expect, describe, test, beforeEach } from '@jest/globals'

import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'
import { handler } from '../../../server/routes.js'
import TestUtil from '../_util/testUtil.js'

const {
    pages,
    constants: {
        CONTENT_TYPE
    }
} = config

describe('#Routes - test site for API response', () => {
    beforeEach(() =>{
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
    
    test(`GET / - should redirect to home page`, async () => {
        const params = TestUtil.defaultHandleParams()
        params.request.method = 'GET'
        params.request.url = '/'

        await handler(...params.values())

        expect(params.response.writeHead).toBeCalledWith(
            302,
            {
                'Location': config.location.home
            }
        )
        expect(params.response.end).toHaveBeenCalled()
    })

    test(`GET /home - should response with ${pages.homeHTML} file stream`, async () => {
        const params = TestUtil.defaultHandleParams()
        params.request.method = 'GET'
        params.request.url = '/home'

        const mockFileStream = TestUtil.generateReadableStream(['data'])

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        )
        .mockResolvedValue({
            stream: mockFileStream
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        )
        .mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHTML)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    })

    test(`GET /controller - should response with ${pages.controllerHTML} file stream`, async () => {
        const params = TestUtil.defaultHandleParams()
        params.request.method = 'GET'
        params.request.url = '/controller'

        const mockFileStream = TestUtil.generateReadableStream(['data'])

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        )
        .mockResolvedValue({
            stream: mockFileStream
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        )
        .mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.controllerHTML)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    })

    test(`GET /index.html - should response with file stream`, async () => {
        const filename = '/index.html'
        const expectedType = '.html'
        
        const params = TestUtil.defaultHandleParams()
        params.request.method = 'GET'
        params.request.url = filename

        const mockFileStream = TestUtil.generateReadableStream(['data'])

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        )
        .mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        )
        .mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
        expect(params.response.writeHead).toHaveBeenCalledWith(
            200,
            {
                'Content-Type': CONTENT_TYPE[expectedType]
            }
        )
    })

    test(`GET /file.ext - should response with file stream`, async () => {
        const filename = '/file.ext'
        const expectedType = '.html'
        
        const params = TestUtil.defaultHandleParams()
        params.request.method = 'GET'
        params.request.url = filename

        const mockFileStream = TestUtil.generateReadableStream(['data'])

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        )
        .mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        )
        .mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
        expect(params.response.writeHead).not.toHaveBeenCalledWith()
    })

    test(`POST /unknown - given an inexistent route it should response with 404 status`, async () => {
        const params = TestUtil.defaultHandleParams()
        params.request.method = 'POST'
        params.request.url = '/unknown'

        await handler(...params.values())

        expect(params.response.writeHead).toHaveBeenCalledWith(404)
        expect(params.response.end).toHaveBeenCalled()
    })

    describe('Exceptions', () => {
        test('Given inexsistent file it should response with 404 status', async () => {
            const params = TestUtil.defaultHandleParams()
            params.request.method = 'GET'
            params.request.url = '/index.png'

            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name
            ).mockRejectedValue(new Error("Error: ENOENT: no such file or directory"))
    
            await handler(...params.values())
    
            expect(params.response.writeHead).toHaveBeenCalledWith(404)
            expect(params.response.end).toHaveBeenCalled()
        })

        test('Given and error it should response with 500 status', async () => {
            const params = TestUtil.defaultHandleParams()
            params.request.method = 'GET'
            params.request.url = '/index.png'

            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name
            ).mockRejectedValue(new Error("Error:"))
    
            await handler(...params.values())
    
            expect(params.response.writeHead).toHaveBeenCalledWith(500)
            expect(params.response.end).toHaveBeenCalled()
        })
    })
})