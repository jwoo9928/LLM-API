"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const cluster_1 = require("cluster");
const os_1 = require("os");
const common_1 = require("@nestjs/common");
const worker_threads_1 = require("worker_threads");
const numCPUs = os_1.default.cpus().length;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(3000);
    common_1.Logger.log(`Worker ${process.pid} started`);
    const worker = new worker_threads_1.Worker(`
      const { parentPort } = require('worker_threads');
      parentPort.postMessage('Worker thread started');
    `, { eval: true });
    worker.on('message', (msg) => {
        console.log(`Message from worker thread: ${msg}`);
    });
    worker.on('error', (err) => {
        console.error(err);
    });
    worker.on('exit', (code) => {
        if (code !== 0)
            console.error(`Worker thread stopped with exit code ${code}`);
    });
}
function setupCluster() {
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        common_1.Logger.log(`Worker ${worker.process.pid} died`);
        common_1.Logger.log('Starting a new worker');
        cluster_1.default.fork();
    });
}
if (cluster_1.default.isPrimary) {
    setupCluster();
}
else {
    bootstrap();
}
//# sourceMappingURL=main.js.map