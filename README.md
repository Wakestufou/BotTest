## Table of Contents
- [📜 Introduction](#-introduction)
- [⚙️ Getting Started](#️-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [With Release](#with-release)
    - [With clone project](#with-clone-project)
  - [Launching the bot](#launching-the-bot)
    - [Dev](#dev)
    - [Production](#production)
- [📄 License](#-license)

# 📜 Introduction
Bot discord that allows adding roles to users with buttons.

# ⚙️ Getting Started
## Prerequisites
- [NodeJS](https://nodejs.org/en/) : v16.13.2
- [npm](https://www.npmjs.com) : 8.5.2

## Installation
### With Release
- Download the latest [release](https://github.com/Wakestufou/Roles-Bot-TS/releases).

```sh
# Go to Roles-Bot-TS
$ cd Roles-Bot-TS

# Configure .env
$ cp .env.exemple .env

# Install
$ npm i
```

⚠️ Don't forget to change the values in the .env ⚠️
<br>
### With clone project
```sh
# Clone project
$ git clone https://github.com/Wakestufou/Roles-Bot-TS.git

# Go to Roles-Bot-TS
$ cd Roles-Bot-TS

# Configure .env
$ cp .env.exemple .env

# Install
$ npm i
```
⚠️ Don't forget to change the values in the .env ⚠️

## Launching the bot
### Dev
```sh
$ npm run start:dev
```
### Production
```sh
# First, build project
$ npm run build

# Launch the bot
$ npm run start:prod
```

# 📄 License
