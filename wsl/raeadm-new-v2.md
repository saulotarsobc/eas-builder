# **Configuração Completa do Ambiente de Build Expo no Ubuntu 22.04**

## **1. Atualizar o Sistema e Instalar Dependências**
Primeiro, atualize os pacotes e instale as dependências necessárias:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip openjdk-17-jdk python3 python3-pip
```
Verifique a instalação do **Java 17**:
```bash
java -version
# Esperado: "openjdk version 17"
```

---

## **2. Instalar o Node.js e Gerenciadores de Pacotes**
Instale o **nvm** (Node Version Manager):
```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
source ~/.bashrc
```
Instale a versão **Node.js 20** e configure como padrão:
```bash
nvm install 20
nvm use 20
nvm alias default 20
```
Instale os pacotes globais necessários:
```bash
npm install -g yarn pnpm bun node-gyp expo-cli eas-cli
```

---

## **3. Instalar o Android SDK e NDK**
### **Criar Diretórios e Baixar as Ferramentas**
Crie a estrutura para o **Android SDK**:
```bash
mkdir -p $HOME/Android/Sdk/cmdline-tools
cd $HOME/Android/Sdk
```
Baixe e extraia as ferramentas de linha de comando do Android:
```bash
wget https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip -O latest.zip
unzip latest.zip
rm latest.zip
mv cmdline-tools latest
mkdir -p $HOME/Android/Sdk/cmdline-tools
mv latest $HOME/Android/Sdk/cmdline-tools/latest
```
Agora a estrutura correta será:
```
~/Android/Sdk/cmdline-tools/latest/bin/
```

---

## **4. Configurar Variáveis de Ambiente**
Adicione automaticamente as variáveis necessárias ao **~/.bashrc**:
```bash
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export ANDROID_SDK_ROOT=$ANDROID_HOME' >> ~/.bashrc
echo 'export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/26.1.10909125' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/platform-tools:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/build-tools/34.0.0:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## **5. Instalar os Pacotes Necessários do Android**
Agora, instale os pacotes essenciais do **SDK**:
```bash
sdkmanager --install "platform-tools" "platforms;android-34" "build-tools;34.0.0" "cmdline-tools;latest" "ndk;26.1.10909125"
```
Verifique se os pacotes foram instalados corretamente:
```bash
sdkmanager --list | grep "installed"
```

Se aparecer um erro de caminho inconsistente, corrija a pasta duplicada **latest-2**:
```bash
rm -rf ~/Android/Sdk/cmdline-tools/latest
mv ~/Android/Sdk/cmdline-tools/latest-2 ~/Android/Sdk/cmdline-tools/latest
```

---

## **6. Configurar o Expo CLI e EAS**
Faça login no **Expo Application Services (EAS)**:
```bash
eas login
```
Verifique se o ambiente está funcionando corretamente, rodando um build de teste:
```bash
eas build --platform android
```

---

## **7. Testar a Configuração**
Verifique todas as versões instaladas:
```bash
node -v
npm -v
yarn -v
pnpm -v
bun -v
java -version
sdkmanager --list
```

Se precisar rodar o `sdkmanager` diretamente:
```bash
$HOME/Android/Sdk/cmdline-tools/latest/bin/sdkmanager --list
```
