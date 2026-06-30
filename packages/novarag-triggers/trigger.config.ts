import { defineConfig } from "@trigger.dev/sdk/v3";
import { pythonExtension } from "@trigger.dev/python/extension";

export default defineConfig({
  project: "proj_vefywzaovevdsrvkjiwx",
  runtime: "bun",
  logLevel: "log",
  // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
  // You can override this on an individual task.
  // See https://trigger.dev/docs/runs/max-duration
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  build: {
    external: ["onnxruntime-node"],
    extensions: [
      pythonExtension({
        // The path to your requirements.txt file
        requirementsFile: "./requirements.txt",
        // The path to your Python binary
        devPythonBinaryPath: `venv/bin/python`,
        // The paths to your Python scripts to run
        scripts: ["src/python/**/*.py"],
      }),
    ],
  },
  
  dirs: ["./src/trigger"],
});
