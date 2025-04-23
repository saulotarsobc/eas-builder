import { spawn } from "child_process";

interface RunCommand {
    label: string;
    command: string;
    args?: string[];
}

function run({ label, command, args = [] }: RunCommand) {
    console.log(`\n=== ${label} ===`);

    const proc = spawn(command, args, { stdio: "inherit", shell: true });

    proc.on("error", (err) => {
        console.error(`Erro ao executar "${command}":`, err.message);
    });

    proc.on("exit", (code) => {
        if (code !== 0) {
            console.error(`Processo "${command}" terminou com código ${code}`);
        }
    });
}

console.log("=== Ambiente de Build Android ===");

run({
    label: "Android SDK Version",
    command: "sdkmanager --version"
});

run({
    label: "Android NDK Version",
    command: `${process.env.ANDROID_NDK_HOME}/ndk-build --version`
});

run({
    label: "EAS CLI Version",
    command: "eas --version"
});

if (process.env.EXPO_TOKEN) {
    run({
        label: "Autenticando usuário",
        command: "eas",
        args: ["login", "-t", process.env.EXPO_TOKEN]
    });
} else {
    console.warn("\n⚠️  Variável de ambiente EXPO_TOKEN não definida. Usuário não autenticado.");
}

run({
    label: "npm install",
    command: "npm",
    args: ["install"]
});

run({
    label: "Build Android",
    command: "eas",
    args: ["build", "-p", "android", "--profile", "production", "--local", "--non-interactive"]
});
