import http from 'http';
import express from 'express';
import path from 'path';

export default function HttpServer(): http.Server {
  const app = express();
  const server = http.createServer(app);

  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

  return server;
}