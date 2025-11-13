declare module "bun" {
  interface Env {
    PORT: number;
    CLIENT_URL: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    DB_URL: string;
  }
}
