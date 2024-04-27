import { WorkerEntrypoint } from "cloudflare:workers";

export default class WorkerBService extends WorkerEntrypoint {
  fetch() {
    return Response.json({ message: 'Hello World' })
  }

  sayHello() {
    return { message: 'Hello from RPC!' }
  }
}
