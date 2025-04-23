FROM node:18.18.0

# Atualizando e instalando pacotes necessários
RUN apt update && apt upgrade -y && apt install curl unzip zip curl git -y;

# Depencias node
RUN npm install -g eas-cli@latest;

# Instalando Java e Gradle
RUN apt install openjdk-17-jdk -y;
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
RUN java --version;


CMD ["tail" , "-f" , "/dev/null"]