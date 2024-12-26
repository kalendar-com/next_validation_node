// routes/form_validation.route.ts

import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createFormValidation,
  getAllFormValidation,
  getFormValidationById,
  getFormValidationDetails,
  updateFormValidation,
  deleteFormValidation,
} from "./form_validation.service";

import {RouteParams} from "./dto/form_validation.dto";
export  async function formValidationRoutes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.post("/", async (request, reply) => {
    try {
      const body = request.body as {
        form: number;
        section?: string;
        id_declaration?: string;
        added_field?: any;
        counted_field?: any;
      };
      
      if (!body.form) {
        return reply.status(400).send({ error: "'form' is required" });
      }

      const newRecord = await createFormValidation(body);
      return reply.status(201).send(newRecord);
    } catch (error) {
      console.error("Error creating form_validation:", error);
      return reply
        .status(500)
        .send({ error: "Error creating form_validation" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const records = await getAllFormValidation();
      return reply.send(records);
    } catch (error) {
      console.error("Error fetching form_validiation:", error);
      return reply
        .status(500)
        .send({ error: "Error fetching form_validiation" });
    }
  });

  fastify.get("/:id", async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const record = await getFormValidationById(Number(params.id));
      if (!record) {
        return reply.status(404).send({ error: "Record not found" });
      }
      return reply.send(record);
    } catch (error) {
      console.error("Error fetching form_validation by ID:", error);
      return reply
        .status(500)
        .send({ error: "Error fetching form_validiation by ID" });
    }
  });
  fastify.get<{ Params: RouteParams }>("/details/:idTaxPayer/:year/:id", async (request, reply) => {
    const { idTaxPayer, year, id } = request.params;
    const details = await getFormValidationDetails(parseInt(idTaxPayer), parseInt(year), parseInt(id));
    return reply.send(details);
  });

  fastify.patch("/:id", async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = request.body as {
        form?: number;
        section?: string;
        id_declaration?: string;
        added_field?: any;
        counted_field?: any;
        deleted_at?: number | null;
      };
      
      const updatedRecord = await updateFormValidation(Number(params.id), body);
      return reply.send(updatedRecord);
    } catch (error) {
      console.error("Error updating form_validation:", error);
      return reply
        .status(500)
        .send({ error: "Error updating form_validation" });
    }
  });

  fastify.delete("/:id", async (request, reply) => {
    try {
      const params = request.params as { id: string };
      await deleteFormValidation(Number(params.id));
      return reply.status(204).send();
    } catch (error) {
      console.error("Error deleting form_validation:", error);
      return reply
        .status(500)
        .send({ error: "Error deleting form_validation" });
    }
  });
}
