# Setup project Step-by-Step

- [Setup project Step-by-Step](#setup-project-step-by-step)
  - [Techstack](#techstack)
  - [Step 1: Setup Turbo-repo](#step-1-setup-turbo-repo)
    - [1. Install Turbo Repo](#1-install-turbo-repo)
    - [2. Set yarn to repo](#2-set-yarn-to-repo)
    - [3. Install package and first run](#3-install-package-and-first-run)
    - [4. (option if run error) FixBug First run Error](#4-option-if-run-error-fixbug-first-run-error)
      - [Error node version](#error-node-version)
        - [Fix → if need using node v18](#fix--if-need-using-node-v18)
      - [Error need to use node\_modules](#error-need-to-use-node_modules)
        - [Fix → yarn install need node\_module](#fix--yarn-install-need-node_module)
  - [Step 2: Create Backend (serverless framework + lambda)](#step-2-create-backend-serverless-framework--lambda)
    - [1. Create folder apps](#1-create-folder-apps)
    - [2. Install serverless](#2-install-serverless)
    - [3. Install lambda](#3-install-lambda)
    - [4. Install serverless and ts for dev](#4-install-serverless-and-ts-for-dev)
    - [5. Create file handler and serverless.yaml](#5-create-file-handler-and-serverlessyaml)
    - [6. Add script in package.json](#6-add-script-in-packagejson)
    - [7. Run Dev](#7-run-dev)
    - [8. Run Deploy](#8-run-deploy)
  - [Project Folder Structure](#project-folder-structure)

## Techstack

- Turbo-repo
- node18
- frontend next-ts
- backend serverless framework (handler) + lambda

## Step 1: Setup Turbo-repo

### 1. Install Turbo Repo

```bash
yarn dlx create-turbo@latest . --package-manager yarn
```

### 2. Set yarn to repo

```bash
yarn set version stable
or
yarn set version 4.11.0 <-- yarn version as used
```

- commit .yarn/release and .yarnrc.yaml to repo
- edit gitignore and add

```bash
!.yarn/releases
```

### 3. Install package and first run

```bash
rm -rf apps/docs
cd apps/web && yarn add next@14 react@18 react-dom@18 eslint-config-next@14
cd ../.. && yarn install
yarn dev
```

### 4. (option if run error) FixBug First run Error

#### Error node version

##### Fix → if need using node v18

- create file root/.nvmrc

```.nvm
v18.20.2
```

- run command

```bash
nvm use
```

#### Error need to use node_modules

##### Fix → yarn install need node_module

- create/edit file .yarnrc.yml

```bash
nodeLinker: node-modules
```

- edit .gitignore

```bash
.yarn/*
!.yarn/releases
```

- run

```bash
yarn install

yarn dev
```

## Step 2: Create Backend (serverless framework + lambda)

### 1. Create folder apps

```bash
mkdir -p apps/web-service/src
```

### 2. Install serverless

```bash
cd apps/web-service
npm init -y
yarn add -D serverless@3.39.0
```

remark: serverless version 3 is available for serverless config in .env

### 3. Install lambda

```bash
yarn add -D @types/aws-lambda
```

### 4. Install serverless and ts for dev

```bash
yarn add -D serverless-offline@13.3.3 serverless-webpack webpack webpack-node-externals ts-loader ts-node
```

remark: serverless-offline@13.3.3 stable with serverless@3

- create file apps/web-service/webpack.config.js

```javaScript
// webpack.config.js
const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // Mode: production for small Bundle
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  // run env Node.js
  target: 'node',
  // using devtool only Local (debug easier)
  devtool: slsw.lib.webpack.isLocal ? 'source-map' : 'hidden-source-map',

  externals: [nodeExternals()], // not to include node_modules in the Bundle

  entry: slsw.lib.entries, // Webpack will find entry points from serverless.yml

  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },

  module: {
    rules: [
      {
        test: /\.ts$/, // Specify that .ts files should be handled
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },
};
```

- create file apps/web-service/.gitignore

```text
.webpack
```

- create tsconfig.json in apps/web-service/

```bash
tsc --init --target es2020
```

### 5. Create file handler and serverless.yaml

- in root/apps/web-service/src/handler.ts

```javascript
import { APIGatewayProxyHandler } from 'aws-lambda';

export const hello: APIGatewayProxyHandler = async (event, context) => {

  console.log(event.queryStringParameters);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello with Types!",
    }),
  };
};
```

- in root/apps/web-service/serverless.yaml

```yaml
service: web-service
frameworkVersion: "3"
useDotenv: true

provider:
  name: aws
  runtime: nodejs18.x
  region: ap-southeast-1
  logRetentionInDays: 7
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - logs:CreateLogGroup
            - logs:CreateLogStream
            - logs:PutLogEvents
          Resource: "*"
  environment:
    ENVIRONMENT: ${env:ENVIRONMENT}
plugins:
  - serverless-webpack
  - serverless-offline

functions:
  hello:
    handler: src/handler.hello
    events:
      - http:
          path: /hello
          method: get

custom: # Custom variable
  logRetention: # Log retention days by Stage
    dev: 7
    prod: 15
  serverless-offline:
    httpPort: 18000
    lambdaPort: 18001
    reloadHandler: true # force reload handler when have a new request
```

### 6. Add script in package.json

- in root/apps/web-service/package.json

```json
...
  "scripts": {
    "dev": "serverless offline",
    "deploy": "serverless deploy"
  },
...
```

### 7. Run Dev

```bash
yarn dev
```

### 8. Run Deploy


```env
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

ENVIRONMENT=development
```


```gitignore
...
.serverless
```


```bash
yarn deploy
```

```bash
# result
Deploying web-service to stage dev (ap-southeast-1)

✔ Service deployed to stack web-service-dev (98s)

endpoint: GET - https://xxxxxxx.execute-api.ap-southeast-1.amazonaws.com/dev/hello
functions:
  hello: web-service-dev-hello (1 kB)

Monitor all your API routes with Serverless Console: run "serverless --console"
```

## Project Folder Structure

- [`package.json`](./package.json)
- [`README.md`](./README.md)
- [`turbo.json`](./turbo.json)
- `apps/`
  - [`web/`](./apps/web/)
    - [`eslint.config.js`](./apps/web/eslint.config.js)
    - [`next.config.js`](./apps/web/next.config.js)
    - [`next-env.d.ts`](./apps/web/next-env.d.ts)
    - [`package.json`](./apps/web/package.json)
    - [`README.md`](./apps/web/README.md)
    - [`tsconfig.json`](./apps/web/tsconfig.json)
    - `app/`
      - [`globals.css`](./apps/web/app/globals.css)
      - [`layout.tsx`](./apps/web/app/layout.tsx)
      - [`page.module.css`](./apps/web/app/page.module.css)
      - [`page.tsx`](./apps/web/app/page.tsx)
      - `fonts/`
    - `public/`
  - [`web-service/`](./apps/web-service/)
    - [`package.json`](./apps/web-service/package.json)
    - [`README.md`](./apps/web-service/README.md)
    - [`serverless.yaml`](./apps/web-service/serverless.yaml)
    - [`tsconfig.json`](./apps/web-service/tsconfig.json)
    - [`webpack.config.js`](./apps/web-service/webpack.config.js)
    - `src/`
      - [`handler.ts`](./apps/web-service/src/handler.ts)
- `docs/`
  - [`README.md`](./docs/README.md)
- `packages/`
  - [`eslint-config/`](./packages/eslint-config/)
    - [`base.js`](./packages/eslint-config/base.js)
    - [`next.js`](./packages/eslint-config/next.js)
    - [`package.json`](./packages/eslint-config/package.json)
    - [`react-internal.js`](./packages/eslint-config/react-internal.js)
    - [`README.md`](./packages/eslint-config/README.md)
  - [`typescript-config/`](./packages/typescript-config/)
    - [`base.json`](./packages/typescript-config/base.json)
    - [`nextjs.json`](./packages/typescript-config/nextjs.json)
    - [`package.json`](./packages/typescript-config/package.json)
    - [`react-library.json`](./packages/typescript-config/react-library.json)
- [`ui/`](./ui/)
  - [`eslint.config.mjs`](./ui/eslint.config.mjs)
  - [`package.json`](./ui/package.json)
  - [`tsconfig.json`](./ui/tsconfig.json)
  - `src/`
    - [`button.tsx`](./ui/src/button.tsx)
    - [`card.tsx`](./ui/src/card.tsx)
    - [`code.tsx`](./ui/src/code.tsx)

Click any link to open that file or folder on GitHub/Git-compatible viewers.
