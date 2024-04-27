import type WorkerBService from "./workerB.handler";

interface Env {
  WorkerB: Service<WorkerBService>
}

export default {
  async fetch(_request, env) {
    using message = await env.WorkerB.sayHello();
    return Response.json({ rpcMessage: message })
  }
} satisfies ExportedHandler<Env>
