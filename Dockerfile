# Etapa 1: Builder - Instala dependencias y construye la aplicación
FROM node:20-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json primero para aprovechar el cache de capas de Docker
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación para producción
# Asegúrate de que el nombre del proyecto en 'dist/nombre-de-tu-proyecto' sea el correcto.
# Puedes verificarlo en tu archivo angular.json en "defaultProject".
RUN npm run build -- --configuration production

# Etapa 2: Servidor de Producción - Sirve la aplicación con Nginx
FROM nginx:stable-alpine AS production

# Copia los archivos de la aplicación construida desde la etapa 'builder'
# La ruta puede variar. Angular 17+ a menudo usa una carpeta 'browser' dentro del directorio del proyecto.
COPY --from=builder /app/dist/solicitudes-energuaviare/ /usr/share/nginx/html
# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 para acceder a la aplicación
EXPOSE 4200