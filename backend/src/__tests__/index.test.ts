import request from 'supertest';
import app from '../index';

describe('Express App', () => {
  it('should return "Hello, TypeScript Express!" for the root path', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, TypeScript Express!');
  });

  it('should return a greeting message for /api/test', async () => {
    const response = await request(app).get('/api/test?name=John');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, John!' });
  });

  it('should return a default greeting message when no name is provided', async () => {
    const response = await request(app).get('/api/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, World!' });
  });
});