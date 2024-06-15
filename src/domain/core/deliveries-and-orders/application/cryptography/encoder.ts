export abstract class Encoder {
  abstract encode(payload: Record<string, unknown>): Promise<string>
}
