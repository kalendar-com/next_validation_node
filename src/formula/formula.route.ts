// src/formulas/formulas.route.ts

import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createFormula,
  getAllFormulas,
  getFormulaById,
  getFormulasByFormValidationId,
  updateFormula,
  deleteFormula
} from "./formula.service";

export async function formulasRoutes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.post("/", async (request, reply) => {
    const body = request.body as {
      id_form_validation: number;
      validation_code: string;
      expression: string;
      failed_response?: string;
      type?: string;
    };

    const newRecord = await createFormula(body);
    return reply.status(201).send(newRecord);
  });

  fastify.get("/", async (request, reply) => {
    const records = await getAllFormulas();
    return reply.send(records);
  });

  fastify.get("/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const record = await getFormulaById(Number(params.id));
    if (!record) {
      return reply.status(404).send({ error: "Record not found" });
    }
    return reply.send(record);
  });

  fastify.get("/by-form-validation/:id", async (request, reply) => {
    try {
        const params = request.params as { id: string };
        const formulas = await getFormulasByFormValidationId(Number(params.id));
        if (formulas.length === 0) {
            return reply.status(404).send({ error: "No formulas found for the specified form validation ID" });
        }
        return reply.send(formulas);
    } catch (error) {
        console.error("Error fetching formulas by form_validation ID:", error);
        return reply.status(500).send({ error: "Error fetching formulas" });
    }
});

  fastify.patch("/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as {
      validation_code?: string;
      expression?: string;
      failed_response?: string;
      type?: string;
      deleted_at?: number | null;
    };

    const updatedRecord = await updateFormula(Number(params.id), body);
    return reply.send(updatedRecord);
  });

  fastify.delete("/:id", async (request, reply) => {
    const params = request.params as { id: string };
    await deleteFormula(Number(params.id));
    return reply.status(204).send();
  });
}
