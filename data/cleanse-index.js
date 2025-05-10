import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('dads.json', 'utf8'));

const filterStarting = ["See ", "(no definition here"]

const filtered = Object.fromEntries(
  Object.entries(data).filter(
    ([_, value]) => !(value.definition && filterStarting.some(x => value.definition.trim().startsWith(x)))
  )
);

writeFileSync('dads.filtered.json', JSON.stringify(filtered, null, 2), 'utf8');
console.log('Filtered JSON saved to dads.filtered.json');