This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Introduction

<img width="1878" alt="image" src="https://github.com/user-attachments/assets/75eb6ad9-11c0-4fa7-a6e6-811f520328bd" />

Simple flight search app, utilizing [seats.aero partner API](https://developers.seats.aero/reference/cached-search).

## Features

- Search with multiple origin/destination airports
- Filter by minimum/maximum fees
- Filter by direct flights

## Up & Running

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Area of Improvements

- Add more filter parameters
- Implement server-side pagination
- Implements custom range slider to set minimum/maximum fees
- Adding unit tests
- Better aesthetics
