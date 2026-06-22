declare module "bcryptjs" {
  export function hash(data: string, salt: number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function hashSync(data: string, salt: number): string;
  export function compareSync(data: string, encrypted: string): boolean;
  const defaultExport: {
    hash: typeof hash;
    compare: typeof compare;
    hashSync: typeof hashSync;
    compareSync: typeof compareSync;
  };
  export default defaultExport;
}
