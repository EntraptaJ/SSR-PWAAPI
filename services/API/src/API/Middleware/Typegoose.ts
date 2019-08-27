// API/src/API/Middleware/Typegoose.ts
import { MiddlewareFn } from 'type-graphql';
import { Model, Document } from 'mongoose';
import { getClassForDocument } from 'typegoose';

function convertDocument(doc: Document): Object {
  const convertedDocument = doc.toObject();
  const DocumentClass: Function = getClassForDocument(doc);
  Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
  return convertedDocument;
}

export const TypegooseMiddleware: MiddlewareFn = async (_, next): Promise<any> => {
  const result = await next();

  if (Array.isArray(result)) {
    return result.map(item => (item instanceof Model ? convertDocument(item) : item));
  }

  if (result instanceof Model) {
    return convertDocument(result);
  }

  return result;
};
