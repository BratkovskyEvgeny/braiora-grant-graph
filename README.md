# Braiora Grant Graph

Tools for looking at ecosystem grants without the usual spreadsheet mess.

Brand: [braiora.com](https://braiora.com)  
npm: `braiora-grants`

We pull Optimism Retro payouts from the public [Retro-Funding](https://github.com/ethereum-optimism/Retro-Funding) JSON. No Agora API.

## Use the library

```bash
npm i braiora-grants zod
```

```js
import { scoreOpportunityFit } from "braiora-grants";
// see packages/braiora-grants/README.md
```

From this repo:

```bash
pnpm install
pnpm example:integrator
```

## Run the collectors

```bash
pnpm collect:optimism   # writes DuckDB + data/raw/optimism
pnpm export:release     # JSONL under data/releases/YYYY-MM-DD
pnpm api:dev            # localhost:8787
```

Optional: `OGG_OP_TOP_N=50 pnpm collect:optimism` if you only want the top payouts per snapshot.

## Layout

```text
packages/braiora-grants/   npm package (schema + score)
packages/schema|score|sdk|collectors|api/
data/releases/
docs/ATLAS.md              text for OP Atlas
docs/OUTREACH.md           messages for design partners
```

## Publish

1. Put the code on a public GitHub repo  
2. Fix `repository.url` in `packages/braiora-grants/package.json` if needed  
3. `pnpm --filter braiora-grants publish --access public`

## License

MIT — Braiora
