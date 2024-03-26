import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import cluster from 'cluster';
import os from 'os';
import { Logger } from '@nestjs/common';
import { Worker } from 'worker_threads';

const numCPUs = os.cpus().length;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  Logger.log(`Worker ${process.pid} started`);
  const worker = new Worker(`
      const { parentPort } = require('worker_threads');
      parentPort.postMessage('Worker thread started');
    `, { eval: true });

    worker.on('message', (msg) => {
      Logger.log(`Message from worker thread: ${msg}`);
    });

    worker.on('error', (err) => {
      Logger.error(err);
    });

    worker.on('exit', (code) => {
      if (code !== 0)
      Logger.error(`Worker thread stopped with exit code ${code}`);
    });
}

function setupCluster() {
  for (let i = 0; i < numCPUs/2 ; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    Logger.log(`Worker ${worker.process.pid} died`);
    Logger.log('Starting a new worker');
    cluster.fork();
  });
}


if (cluster.isPrimary) {
  setupCluster()
} else {
  bootstrap();
}

