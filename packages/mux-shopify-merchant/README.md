# Shopify Mux Test - Merchant

## Description

The Shopify Mux Test merchant view is a stand-alone application that allows a store owner to authenticate through the Shopify Admin API, live stream from the "Live" page and highlight products in the customer's view context.

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

### Setup Shopify

1. [Create a Development Shopify Store](https://help.shopify.com/en/partners/dashboard/managing-stores/development-stores#create-a-development-store-for-testing-apps-or-themes)

2. Create Products

3. [Create Public Shopify API Key & Secret](https://litextension.com/blog/shopify-api-key/#How-to-Get-Shopify-API-Key-for-Public-Apps)

4. Add the following to `.env` file

```
  NEXT_PUBLIC_SHOPIFY_STORE={store name}

  SHOP={store name}.myshopify.com
  API_KEY={Public Api Key}
  API_SECRET_KEY={Secret Key}
  SCOPES=read_products
  HOST_SCHEME=https
```

### Setup Mux

1. [Create a Mux Live Stream](https://docs.mux.com/guides/video/start-live-streaming)

2. Add the Live Stream Stream Key and Playback Id to the `.env` file

```
  MUX_STREAM_KEY={Stream Key}
  MUX_PLAYBACK_ID={Playback Id}
```

### Setup Firebase Firestore

1. [Create a Firebase Firestore Database](https://cloud.google.com/firestore/docs/create-database-web-mobile-client-library)

2. Create a collection called `stores`

3. Go to Project settings -> Service accounts tab and click on Generate new private key

4. Save service account key json file as `/utils/db/firebase-serviceAccountKey.json`

### Setup Ngrok

1. [Install & Setup Ngrok](https://ngrok.com/docs/getting-started)

2. Run ngrok

   ```bash
     ngrok http 3005
   ```

3. Add ngrok forwarding url to `.env` file

   ```
     HOST={Ngrok forwarding url}
   ```

4. Update your App Setup Redirect URIs to the following

   ![Screen Shot 2022-11-08 at 11 07 17 AM](https://user-images.githubusercontent.com/29506632/200643857-2bd717d0-0b3e-4623-a865-85e5e63ed5b8.png)

## Features

Merchant User can:

- authenticate through the Shopify Admin API as the store owner
- fetch all products through the Shopify Admin API
- enable camera and stream to Mux Live Stream broadcast
- select products to be highlighted in both merchant and customer views

## Usage

Navigate to the Ngrok forwarding url (eg. https://498d-142-198-14-32.ngrok.io)

Click the `Authenticate` button
![Screen Shot 2022-11-08 at 1 23 09 PM](https://user-images.githubusercontent.com/29506632/200651707-9b565ec2-2d9f-4d36-9056-9217204ebb4f.png)

Follow steps to authenticate through the Shopify Admin API
![Screen Shot 2022-11-08 at 1 25 00 PM](https://user-images.githubusercontent.com/29506632/200651726-391370ed-40d4-4137-ba81-9b748d9df6cd.png)

On the live page
![Screen Shot 2022-11-08 at 1 28 14 PM](https://user-images.githubusercontent.com/29506632/200651741-dfe6e502-9e2d-44eb-8797-be38861de9b3.png)

- Click the Enable Camera Button
- Click Start Streaming
- Select a product listed below to feature in both merchant and customer view
- Click Stop Streaming
