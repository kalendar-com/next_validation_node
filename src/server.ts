import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma";
import { formValidationRoutes } from "./form_validation";
import { formulasRoutes } from "./formula";
import cors from "@fastify/cors";
import { env } from "process";

const server = Fastify();

server.register(cors);
server.register(prismaPlugin);
server.register(formValidationRoutes, { prefix: "/api/form_validation" });
server.register(formulasRoutes, { prefix: "/api/formulas" });

server.get("/", async () => {
  return { message: "Fastify API is running!" };
});

server.setErrorHandler((error, request, reply) => {
  console.error(error);
  reply.status(500).send({ error: "Internal Server Error" });
});

const start = async () => {
  try {
    const port = parseInt(env.port ?? "8090");
    await server.listen({
      port: port,
      host: "0.0.0.0",
    });
    console.log("Server is running at http://localhost:" + port);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
