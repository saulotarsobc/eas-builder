import { spawn } from "child_process";
import fs from "fs";
import { LOG_FILE } from "./constants";
import { RunCommand } from "./interfaces";

function writeLog(message: string) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logLine, { encoding: "utf-8" });
}

function run({ label, command, args = [] }: RunCommand): Promise<void> {
  return new Promise((resolve, reject) => {
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
      reject(err);
    });

    proc.on("exit", (code) => {
      const statusMsg =
        code === 0
          ? `✅ Comando "${command}" executado com sucesso.`
          : `❌ Processo "${command}" terminou com código ${code}`;
      writeLog(statusMsg);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Processo terminou com código ${code}`));
      }
    });
  });
}

async function main() {
  try {
    if (process.env.EXPO_TOKEN) {
      await run({
        label: "Autenticando usuário",
        command: "eas whoami",
      });
    } else {
      const warning = "⚠️  EXPO_TOKEN não definida. Usuário não autenticado.";
      console.warn(`\n${warning}`);
      writeLog(warning);
    }

    await run({
      label: "Android SDK Version",
      command: "sdkmanager --version",
    });

    await run({
      label: "Android NDK Version",
      command: `${process.env.ANDROID_NDK_HOME}/ndk-build --version`,
    });

    await run({
      label: "Java Version",
      command: "java -version",
    });

    await run({
      label: "EAS CLI Version",
      command: "eas --version",
    });

    await run({
      label: "npm install",
      command: "npm install",
      args: ["install"],
    });

    await run({
      label: "Build Android",
      command: "eas",
      args: ["build", "-p", "android", "--profile", "production", "--local"],
    });
  } catch (error) {
    console.error("Erro durante a execução:", error);
    process.exit(1);
  }
}

main();