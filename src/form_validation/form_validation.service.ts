
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createFormValidation(data: {
  form: number;
  section?: string;
  id_declaration?: string;
  added_field?: any;
  counted_field?: any;
}) {
  const now = Date.now();
  
  return prisma.form_validation.create({
    data: {
      form: data.form,
      section: data.section,
      id_declaration: data.id_declaration,
      added_field: data.added_field,
      counted_field: data.counted_field,
      created_at: Math.floor(now / 1000),
      updated_at: Math.floor(now / 1000),
    },
  });
}

export async function getAllFormValidation() {
  return prisma.form_validation.findMany();
}

export async function getFormValidationById(id: number) {
  return prisma.form_validation.findUnique({
    where: { id },
  });
}

export async function getFormValidationDetails(idTaxPayer: number, year: number, id:number) {
  const formValidations = await prisma.form_validation.findMany({
    where: {
      id: id
    },
    include: {
      formulas: true
    }
  });

  const sqlQueries = formValidations.flatMap(validation => {
    const sections = validation.section?.split(',') || [];
    const declarations = validation.id_declaration?.split(',') || [];
    return sections.flatMap(section => 
      declarations.map(declaration => 
        `SELECT * FROM [dbo].[${section}_${declaration}_${year}] WHERE Id_Contrib = ${idTaxPayer}`
      )
    );
  });

  const response = {
    form: formValidations[0]?.form.toString(),
    idTaxPayer: `${idTaxPayer}`,
    sql_query: sqlQueries,    
    addedFields: formValidations.map(validation => 
      validation.added_field?.replace(/["]+/g, '') ?? ''
    ),
    countedFields: formValidations.map(validation => 
      validation.counted_field?.replace(/["]+/g, '') ?? ''
    ),
    formulas: formValidations.flatMap(validation => 
      validation.formulas.map(formula => ({
        validationCode: formula.validation_code,
        expression: formula.expression,
        failed_response: formula.failed_response,
        type: formula.type
      }))
    )
  };

  return response;
}

export async function updateFormValidation(
  id: number,
  data: {
    form?: number;
    section?: string;
    id_declaration?: string;
    added_field?: any;
    counted_field?: any;
    deleted_at?: number | null;
  }
) {
  const now = Date.now();
  return prisma.form_validation.update({
    where: { id },
    data: {
      ...data,
      updated_at: Math.floor(now / 1000),
    },
  });
}

export async function deleteFormValidation(id: number) {
  return prisma.form_validation.delete({
    where: { id },
  });
}
