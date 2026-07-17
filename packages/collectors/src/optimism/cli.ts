import { collectOptimism } from "./collect.js";

const topN = process.env.OGG_OP_TOP_N
  ? Number(process.env.OGG_OP_TOP_N)
  : undefined;

collectOptimism({ topN })
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
