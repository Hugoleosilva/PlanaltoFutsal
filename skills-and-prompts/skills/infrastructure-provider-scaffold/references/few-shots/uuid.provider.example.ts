import { randomUUID } from "node:crypto";

export interface UuidProvider {
  generate(): string;
}

export class NodeUuidProvider implements UuidProvider {
  generate(): string {
    return randomUUID();
  }
}
