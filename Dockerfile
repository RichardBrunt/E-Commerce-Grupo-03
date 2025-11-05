# Etapa de build
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
# Descarga dependencias en caché
RUN mvn -q -e -DskipTests dependency:go-offline
# Copia el código fuente y compila
COPY src ./src
RUN mvn -q -DskipTests package

# Etapa de runtime
FROM eclipse-temurin:17-jre
ENV TZ=America/Argentina/Buenos_Aires
WORKDIR /app
# Variables de entorno para conectar a MySQL en distintos entornos
# Estas se pueden sobreescribir en docker-compose o con -e
ENV DB_HOST=localhost \
    DB_PORT=3307 \
    DB_USERNAME=root \
    DB_PASSWORD=root \
    JAVA_OPTS=""

# Copiar el JAR generado
COPY --from=builder /app/target/e_commerce-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
# Perfil por defecto ya es mysql (application.properties). Permite sobreescribir con SPRING_PROFILES_ACTIVE
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
