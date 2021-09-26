
import HttpServer from './http'
import SocketServer from "./socket";
import logger from "./logger";

const HTTP_PORT = process.env.HTTP_PORT || 3000;

async function app() {
  const io = SocketServer();

  const httpServer = HttpServer();

  io.attach(httpServer)

  httpServer.listen(HTTP_PORT, () => logger.info('http server listening on :%s', HTTP_PORT))
}

app();