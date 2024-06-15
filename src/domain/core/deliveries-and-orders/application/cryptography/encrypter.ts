export abstract class Encrypter {
  abstract hash(painText: string): Promise<string>
  abstract compare(painText: string, hash: string): Promise<boolean>
}
