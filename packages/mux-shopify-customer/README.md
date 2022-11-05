# Shopify Mux Test - Customer

## Description

The Shopify Mux Test customer view is a stand-alone application that utilizes Shopify's `Hydrogen` stack to create a custom storefront allowing us to add addition routes for viewing live streams.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher
- Yarn

## Installation

```bash
yarn install
yarn dev
```

Update `hydrogen.config.js` with your shop's domain and Storefront API token

```
PUBLIC_STORE_NAME={ store  name }
PUBLIC_STORE_DOMAIN={ store name }.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN={storefront api token}

NODE_ENV=development
```

Update `/src/services/firebase.js` config with firebase details create as part of Merchant setup

## Features

Customer User can:

- see default hydrogen store features (products, cart, etc)
- navigate to watch live route when stream is happening

## Usage

When Merchant has started a live stream

- click on to `Watch Live` header link
- click play on player
