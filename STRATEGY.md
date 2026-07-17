# Braiora Grant Graph — notes

Product under [braiora.com](https://braiora.com).  
npm package: `braiora-grants`.

Aim: get into Optimism Retro (Dev Tooling) with something people actually import, not a landing page.

## Stack

- TypeScript monorepo  
- DuckDB on the laptop  
- Postgres later only if we host a real multi-user API  
- VPS (Selectel etc.) when cron/API need to stay up

## Data

- Optimism awards: Retro-Funding GitHub JSON  
- Agora: skip  

## Order of ecosystems

1. Optimism Retro Dev Tooling  
2. Solana public goods  
3. EF ESP when the dataset looks serious enough  

## Checklist

- [x] public-ish repo layout, MIT  
- [x] Optimism collector + JSONL releases  
- [x] `braiora-grants` package builds  
- [ ] push to GitHub  
- [ ] `npm publish`  
- [ ] 3 projects that import the package  
- [ ] OP Atlas (see docs/ATLAS.md)  

## Don’t bother with (for now)

- Agora keys  
- “AI grant matcher” marketing  
- scraping 30 chains badly  
