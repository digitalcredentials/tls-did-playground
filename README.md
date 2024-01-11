## This repo was archived on January 11, 2024 by [[alexfigtree](https://github.com/alexfigtree)]

# tls-did-playground

The tls-did-playground provides an example usage of the tls-did libraries.

# Development
## Prerequisite

- Clone the [tls-did-registry](https://github.com/digitalcredentials/tls-did-registry) repository into the same parent directory as the **tls-did-playground**

- Minimum node.js: v14.3.0
  ```
  node -v
  ```


## Installation

In **tls-did-registry** & **tls-did-playground**:

```
npm i
```

## Pre Run

In src/index.js you can switch between a local testnet and a testnet of your choice. To add a testnet of you choice add a publicEnv.json in the project directory.

**publicEnv.json format:**

```json
{
  "privateKey":<ethereum private key>,
  "registryAddress":<registry address>,
  "rpcUrl":<rpcUrl>
}
```
**Goerli**

```json
{
  "privateKey":<ethereum private key>,
  "registryAddress":"0x60492b0755D8dba01dB9915a1f8Bf28D242BF6dC",
  "rpcUrl":"https://goerli.infura.io/v3/923dab15302f45aba7158692f117ac0c"
}
```

**Local Testnet**

```
npm run testnet
npm run deployRegistry
```

## Run

```
npm run start
```

# Documentation

The documentation for the TLS-DID Method and it's libraries can be found in the [tls-did repository](https://github.com/digitalcredentials/tls-did/blob/master/README.md).
