// unit testing for the forecast api adapter with jest

const request = require('supertest');

const server = require('../server.js');

describe('forecast api adapter', () => {
    describe('GET /', () => {
        it('should return 200 OK', () => {
        return request(server)
            .get('/')
            .then(res => {
            expect(res.status).toBe(200);
            });
        });
        
        /*
        it('should return JSON', () => {
        return request(server)
            .get('/')
            .then(res => {
            expect(res.type).toMatch(/json/i);
            });
        });
        */
    
    });
    });


