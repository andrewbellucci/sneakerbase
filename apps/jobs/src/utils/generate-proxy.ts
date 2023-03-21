import { env } from "./env";

export const generateProxy = (protocol: 'http' | 'https') => {
  return {
    proxy: {
      protocol,
      host: env.PROXY_HOST,
      port: Number(env.PROXY_PORT),
      auth: {
        username: env.PROXY_USERNAME,
        password: env.PROXY_PASSWORD,
      }
    }
  };
}

export const generateProxyString = (protocol: 'http' | 'https') => {
  return `${
    protocol
  }://${
    env.PROXY_USERNAME
  }:${
    env.PROXY_PASSWORD
  }@${
    env.PROXY_HOST
  }:${
    env.PROXY_PORT
  }`;
}
