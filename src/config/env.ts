const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[ENV] Missing envronement variable : ${key}`);
  }
  return value;
};

export const config = {
  jwt: {
    secret: getEnv("JWT_SECRET"),
  },

  server: {
    port: getEnv("PORT"),
    node_env: getEnv("NODE_ENV"),
  },

  database: {
    url: getEnv("DATABASE_URL"),
    directUrl: getEnv("DIRECT_URL"),
  },
};
