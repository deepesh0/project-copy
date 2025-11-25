import { Iplayload } from "./interface.types";

declare global {
  namespace Express {
    interface Request {
      user: Iplayload | null;
    }
  }
}
