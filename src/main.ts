import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as notReallyCluster from 'cluster';
import * as os from 'os';
import { Logger } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const numCPUs = os.cpus().length;
const cluster = notReallyCluster as unknown as notReallyCluster.Cluster;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
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

