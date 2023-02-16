# newsletter-public

- Dentro de la carpeta api y client: npm install
- Dentro de la carpeta /api/src: npx sequelize db:migrate

- Es necesario crear la siguiente carpeta y subcarpetas dentro de la carpeta /api/src

/storage
  //images
    ///gallery
    ///resized
  //tmp

Posteriormente se recomenda incluir la carpeta /storage en .gitignore

- Es necesario crea un archivo .env en la carpeta api con las siguientes claves

OPENAI_API_KEY=
DATABASE_HOST="localhost"
DATABASE_DIALECT="mysql"
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
EMAIL=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=
GOOGLE_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
JWT_SECRET=

