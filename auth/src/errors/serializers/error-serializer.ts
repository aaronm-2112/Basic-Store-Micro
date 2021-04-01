export abstract class ErrorSerializer {
  abstract serializeErrors(): errorformat[];
  msg?: string;
}

export interface errorformat {
  msg: string;
}
