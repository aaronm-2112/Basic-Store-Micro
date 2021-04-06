import { ErrorSerializer } from "./error-serializer";

export class SingleErrorSerializer extends ErrorSerializer {
  msg: string;

  constructor(msg: string) {
    super();
    this.msg = msg;
  }

  serializeErrors() {
    return [{ msg: this.msg }];
  }
}
