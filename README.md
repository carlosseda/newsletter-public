# PRÁCTICA DE PANEL DE ADMINISTRACIÓN NEWSLETTER PARA CURSOS DE FORMACIÓN DE DESARROLLO WEB

- Dentro de la carpeta api y client: npm install

- Es necesario crear la siguiente carpeta y subcarpetas dentro de la carpeta /api/src

/storage <br />
  //images  <br />
    ///gallery <br />
    ///resized <br />
  //tmp <br />

Posteriormente se recomenda incluir la carpeta /storage en .gitignore

- Es necesario crea un archivo .env en la carpeta api con las siguientes claves. Las más importantes para que arranque el proyecto
son la DATABASE_USER , DATABASE_PASSWORD, DATABASE_NAME Y JWT_SECRET (poner una palabra aleatoria lo suficiente larga y compleja). Para los datos de GOOGLE seguir esta guía para generar el token:

https://stateful.com/blog/gmail-api-node-tutorial

OPENAI_API_KEY=  <br />
DATABASE_HOST="localhost" <br />
DATABASE_DIALECT="mysql"<br />
DATABASE_USER=<br />
DATABASE_PASSWORD=<br />
DATABASE_NAME=<br />
EMAIL=<br />
EMAIL_PASSWORD=<br />
EMAIL_HOST=<br />
EMAIL_PORT=<br />
GOOGLE_EMAIL=<br />
GOOGLE_CLIENT_ID=<br />
GOOGLE_CLIENT_SECRET=<br />
GOOGLE_REFRESH_TOKEN=<br />
JWT_SECRET=<br />

- Dentro de /api/config/config.json pondremos también las credenciales de acceso a la base de datos

  "development": { /<br />
        "username": "root", <br />
        "password": "password",<br />
        "database": "detectives",<br />
        "host": "127.0.0.1",<br />
        "dialect": "mysql"<br />
    },<br />

- Dentro de la carpeta /api/src: npx sequelize db:migrate

- El proyecto usa webpack, si hacemos cambios en los webcomponents de la carpeta client, dentro de la misma carpeta /client debemos escribir: npx webpack

- Se debería rellenar las tablas de menu, image_configurations y users

