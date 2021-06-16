# About

:D

# Setup

```
docker pull node:14
docker run --rm -it -w "/workdir" -v "$(pwd):/workdir" -p "3123:3000" node:14 bash

yarn install
yarn run start
```