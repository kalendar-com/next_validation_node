import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createFormula(data: {
  id_form_validation: number;
  validation_code: string;
  expression: string;
  failed_response?: string;
  type?: string;
}) {
  const now = Date.now();
 console.log({data});
  return prisma.formulas.create({
    data: {
      validation_code: data.validation_code,
      expression: data.expression,
      failed_response: data.failed_response,
      type: data.type,
      created_at: Math.floor(now / 1000),
      updated_at: Math.floor(now / 1000),
      id_form_validation: data.id_form_validation
    },
  });
}

export async function getFormulasByFormValidationId(formValidationId: number) {
    return prisma.formulas.findMany({
        where: {
            id_form_validation: formValidationId
        }
    });
}

export async function getAllFormulas() {
  return prisma.formulas.findMany();
}

export async function getFormulaById(id: number) {
  return prisma.formulas.findUnique({
    where: { id },
  });
}

export async function updateFormula(
  id: number,
  data: {
    validation_code?: string;
    expression?: string;
    failed_response?: string;
    type?: string;
    deleted_at?: number | null;
  }
) {
  const now = Date.now();
  return prisma.formulas.update({
    where: { id },
    data: {
      ...data,
      updated_at: Math.floor(now / 1000),
    },
  });
}

export async function deleteFormula(id: number) {
  return prisma.formulas.delete({
    where: { id },
  });
}
