# WASSCE Maths Academy — starter website

A mobile-friendly Next.js starter site for a Ghana-focused WASSCE Core Mathematics learning platform.

## Included in this first version

- Branded homepage and responsive navigation
- Core Mathematics course catalogue
- Sample Algebra lesson with worked solution
- Interactive five-question practice quiz with feedback and score
- Student dashboard preview
- About page
- Supabase SQL starter schema and environment template

## Important status note

This is a front-end prototype. The dashboard is demo data; accounts, saved progress, admin tools, video hosting and payments are **not connected yet**. Do not collect student personal information or accept payments through this prototype. The curriculum outline and sample questions should be checked against the current WAEC syllabus and reviewed before public course delivery.

## Run locally

You need Node.js 18.17 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To create a production build:

```bash
npm run build
npm start
```

## Free / low-cost deployment path

1. Create a GitHub account and upload this project to a private or public repository.
2. Create a free Supabase project for authentication and database.
3. Copy `.env.example` to `.env.local` and add the Supabase project URL and anon key.
4. Deploy the Next.js project to Vercel. Connect the GitHub repository and add the same environment variables in Vercel.
5. Add a custom domain later, after testing the free deployment.

Free-plan limits and provider terms can change. Check current terms before launch.

## Supabase setup (next development stage)

Run `supabase/schema.sql` in the Supabase SQL Editor. Then implement sign-up/sign-in, protected student routes, server-side authorization and progress persistence before using real student accounts.

## Payments

Payment integration is intentionally not included in this prototype. Before taking fees, register/verify a merchant account with a suitable Ghana-supported provider (for example, Paystack or Hubtel), confirm fees and settlement terms, and implement server-side payment verification plus webhook handling. Never trust a browser-only “payment successful” flag.

## Content and copyright

Use original teaching scripts and properly licensed or permission-cleared notes, questions, diagrams and video. Do not upload copyrighted past papers or commercial materials without permission. Confirm the applicable WAEC syllabus and exam format before describing materials as official or complete.
