declare module "bun" {
  interface Env {
    PORT: number;
    CLIENT_URL: string;
  }
}
