# pems
A javascript full-stack power equipment management system.

## Demo

Demo Address: [Power Equipment Management System](https://pems.rannstudio.com) <br/>
Account: admin/admin

## Screenshots

* Login Page

 ![login](https://raw.githubusercontent.com/Rannie/pems/master/screenshots/pems-1.png)

* List Page

![list](https://raw.githubusercontent.com/Rannie/pems/master/screenshots/pems-2.png)

* Add Page

![add](https://raw.githubusercontent.com/Rannie/pems/master/screenshots/pems-3.png)

* Add Popup

![popup](https://raw.githubusercontent.com/Rannie/pems/master/screenshots/pems-4.png)

## Tech Stack

### Frontend

- [ ] Typescript
- [x] React
- [x] React-Router
- [ ] React-Redux
- [x] Ant Design
- [x] Axios
- [ ] GraphQL
- [x] AliOSS
- [ ] i18n
- [x] Sass
- [x] ESLint
- [x] Babel
- [x] Webpack

### Backend (Node)

- [x] Koa2
- [ ] Express
- [ ] Egg
- [x] MongoDB

## Setup

### Backend

* MongoDB

Add your MongoDB path in *server/config/index.js*.

![mongo](https://raw.githubusercontent.com/Rannie/pems/master/screenshots/mongo-path.png)

* Other Config

**JWT Secret**, **expire date**, **serve path** also can be modified in *server/config/index.js*.

### Frontend

* Aliyun OSS

Set **OSS_REGION**, **OSS_ACCESS_KEY_ID**, **OSS_ACCESS_KEY_SECRET**, **OSS_BUCKET** in *views/src/constants.js*.

* Home URL

Set **HOME_URL** in *views/src/constants.js*, system will redirect to this address when JWT expires.

* API Base URL

Set **SERVICE_URL** in *views/config/prod.env.js*. (Deploy Mode)

### Debug

* build 

```bash
cd views/
npm run build
```

* serve page & start api server

require [pm2](https://pm2.keymetrics.io/)

```bash
cd server/
npm run dev
```

Then you can open http://127.0.0.1:3010

## Deployment

Upload website dist & server code to your server, and run ```npm run start``` in server folder. 
(default webpage path is */var/www/pems*, you can config it in *server/config/index.js*)

## License

MIT License

Copyright (c) 2019 Hanran Liu
