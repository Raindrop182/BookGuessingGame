import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string; // add your custom session property
  }
}
