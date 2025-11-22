# Setup project

## Techstack

- Turbo-repo
- frontend next-ts
- backend serverless framework (handler) + lambda

## Setup Turbo-repo

### 1. Install Turbo Repo

```bash
yarn dlx create-turbo@latest . --package-manager yarn
```

### 2. set yarn to repo

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
yarn dev
```

### 4. (option if run error) FixBug First run Error

#### Error node version

##### Fix → using node v20.19.4

- create file root/.nvmrc

```yaml
v20.19.4
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
