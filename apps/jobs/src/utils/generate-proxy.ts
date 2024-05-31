import { env } from "./env";

export const generateProxy = (protocol: 'http' | 'https', bright?: boolean) => {
  return {
    proxy: {
      protocol,
      host: bright ? env.BRIGHT_PROXY_HOST : env.PROXY_HOST,
      port: Number(bright ? env.BRIGHT_PROXY_PORT : env.PROXY_PORT),
      auth: {
        username: bright ? env.BRIGHT_PROXY_USERNAME : env.PROXY_USERNAME,
        password: bright ? env.BRIGHT_PROXY_PASSWORD : env.PROXY_PASSWORD,
      }
    }
  };
}

export const generateProxyString = (protocol: 'http' | 'https', bright?: boolean) => {
  return `${
    protocol
  }://${
    bright ? env.BRIGHT_PROXY_USERNAME : env.PROXY_USERNAME
  }:${
    bright ? env.BRIGHT_PROXY_PASSWORD : env.PROXY_PASSWORD
  }@${
    bright ? env.BRIGHT_PROXY_HOST : env.PROXY_HOST
  }:${
    bright ? env.BRIGHT_PROXY_PORT : env.PROXY_PORT
  }`;
}
