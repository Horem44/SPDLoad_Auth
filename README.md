# SPDLoad_Auth
Test assignment for SPDLoad company

# Technologies used in development

ReactJS, NestJS, MySQL, TypeORM, Multer, Sharp

# Description

An application in which the user can log in, register, confirm registration by sending a letter with a token to the mail. The user has the ability to view his profile, change data and photo. I completed an additional task, each photo that the user uploads is cut into three sizes: 200x200, 400x400, 600x600. Photos in three different sizes are displayed in his profile, by clicking on them you can get them from the server.

# Installation

Run npm install

add to .env file in backend folder your credentials: (mysql database)

DB_HOST=<DB_HOST>

DB_PORT=<DB_PORT>

DB_USERNAME=<DB_USERNAME>

DB_PASSWORD=<DB_PASSWORD>

DB=<DB_NAME>

JWT_SECRET=<JWT_SECRET>

VERIFICATION_SECRET=<VERIFICATION_SECRET>

In backend folder run: npm run start:dev
In frontend folder run: npm start
