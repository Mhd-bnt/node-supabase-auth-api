export global {
  namespace Express {
    interface Request {
      user?: {
        id: Number;
        email: String;
      };
    }
  }
}

export {};
