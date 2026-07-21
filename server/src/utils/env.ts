if (!process.env.JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
}

export const JWT_SECRET = process.env.JWT_SECRET as string;
