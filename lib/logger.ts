import pino from "pino";
import packageJson from "../package.json";

const isEdge = process.env.NEXT_RUNTIME === "edge";
const isProduction = process.env.NODE_ENV === "production";
const hasPrettyTransport =
  "pino-pretty" in (packageJson.dependencies ?? {}) ||
  "pino-pretty" in (packageJson.devDependencies ?? {});

const baseOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

const prettyTransport =
  !isEdge && !isProduction && hasPrettyTransport
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
        },
      }
    : undefined;

const logger = (() => {
  if (!prettyTransport) {
    return pino(baseOptions);
  }

  return pino({
    ...baseOptions,
    transport: prettyTransport,
  });
})();

export default logger;
