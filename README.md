# <a name="0"></a>Dashboard Server


## Contents

 - [Scripts](#scripts)
 - [Environment Variables](#environment-variables)


## Scripts

Start local (development) server
```bash
npm run start:dev
```

Compile TypeScript files into `/dist`
```bash
npm run build
```

Start (production) server from `/dist`
```bash
npm start
```

Combined build & start
```bash
npm run build && npm start
```


## Environment Variables
| Key | Description |
|-----|-------------|
|`ANSWERHUB_URL`|AnswerHub API|
|`ANSWERHUB_TOKEN`|AnswerHub API auth|
|`CLIENT`|React app URL|
|`DB_HOST`|SQL DB URL|
|`DB_PORT`|SQL DB port|
|`DB_PASSWORD`|SQL DB password|
|`DB_USER`|SQL DB user|
|`LOCAL_PATH`|SQL DB path to `mysql.sock` (if running locally)|
|`LOCAL_USER`|SQL DB user (if running locally)|
|`JIRA_URL`|JIRA API|
|`JIRA_TOKEN`|JIRA API auth|
|`JWT_SECRET`|JSON Web Token secret|
