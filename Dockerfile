name: Docker Image Node Express

on:
  push:
    branches: [ "master" ]
  pull_request:
    branches: [ "master" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build app with Nx
        run: npx nx build api

      - name: Build Docker image
        run: docker build . --file Dockerfile --tag my-image-name:$(date +%s)
