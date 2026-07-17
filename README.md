# Braiora Grant Graph

Tools for looking at ecosystem grants without the usual spreadsheet mess.

- Brand: [braiora.com](https://braiora.com)  
- npm: [braiora-grants](https://www.npmjs.com/package/braiora-grants)  
- GitHub: [BratkovskyEvgeny/braiora-grant-graph](https://github.com/BratkovskyEvgeny/braiora-grant-graph)  

Optimism Retro payouts come from public [Retro-Funding](https://github.com/ethereum-optimism/Retro-Funding) JSON. No Agora API.

## Use the library

```bash
npm i braiora-grants zod
```

```js
import { scoreOpportunityFit } from "braiora-grants";
```

See `packages/braiora-grants/README.md`.

From this repo:

```bash
pnpm install
pnpm example:integrator
```

## Collectors

```bash
pnpm collect:optimism
pnpm export:release
pnpm api:dev
```

## Layout

```text
packages/braiora-grants/   published npm package
packages/schema|score|sdk|collectors|api/
data/releases/
docs/ATLAS.md
docs/OUTREACH.md
```

## Next

1. Register on [OP Atlas](https://atlas.optimism.io/) — copy from `docs/ATLAS.md`  
2. Get a few projects importing `braiora-grants` — `docs/OUTREACH.md`  

## License

MIT — Braiora
