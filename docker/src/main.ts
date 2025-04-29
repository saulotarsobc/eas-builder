import { spawn } from "child_process";
import fs from "fs";
import { exit } from "process";

interface RunCommand {
  label: string;
  command: string;
  args?: string[];
}

const LOG_FILE = "/build/build.log";

function writeLog(message: string) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logLine, { encoding: "utf-8" });
}

function run({ label, command, args = [] }: RunCommand) {
  console.log(`\n[${label.toUpperCase()}]`);
  writeLog(`\n[${label}]`);

  const proc = spawn(command, args, { shell: true });

  proc.stdout?.on("data", (data) => {
    const output = data.toString().trim();
    console.log(output);
    writeLog(output);
  });

  proc.stderr?.on("data", (data) => {
    const output = data.toString().trim();
    console.error(output);
    writeLog(output);
  });

  proc.on("error", (err) => {
    const errorMsg = `Erro ao executar "${command}": ${err.message}`;
    console.error(errorMsg);
    writeLog(errorMsg);
  });

  proc.on("exit", (code) => {
    const statusMsg =
      code === 0
        ? `✅ Comando "${command}" executado com sucesso.`
        : `❌ Processo "${command}" terminou com código ${code}`;
    writeLog(statusMsg);
  });
}

run({
  label: "Android SDK Version",
  command: "sdkmanager --version",
});

run({
  label: "Android NDK Version",
  command: `${process.env.ANDROID_NDK_HOME}/ndk-build --version`,
});

run({
  label: "EAS CLI Version",
  command: "eas --version",
});

exit();

if (process.env.EXPO_TOKEN) {
  run({
    label: "Autenticando usuário",
    command: "eas whoami",
  });
} else {
  const warning = "⚠️  EXPO_TOKEN não definida. Usuário não autenticado.";
  console.warn(`\n${warning}`);
  writeLog(warning);
}

run({
  label: "npm install",
  command: "npm",
  args: ["install"],
});

run({
  label: "Build Android",
  command: "eas",
  args: ["build", "-p", "android", "--profile", "production", "--local"],
});
