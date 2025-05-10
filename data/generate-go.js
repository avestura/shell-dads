import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('./dads.filtered.json', 'utf8'));

const header = `package dads

type TermEntry struct {
    Definition   string
    AlsoKnownAs  string
    Text         string
}

var Terms = map[string]TermEntry{
`

const goLines = []

const escape = str => str.replaceAll('"', '\\"')

for(const [k ,v] of Object.entries(data)) {
    goLines.push(`"${k}": {Definition: "${escape(v.definition)}", AlsoKnownAs: ${v.alsoKnownAs ? '"' + escape(v.alsoKnownAs) + '"' : '""'}, Text: "${escape(v.text)}"},`)
}

writeFileSync('../dads/dads.filtered.go', header + goLines.join('\r\n') + '}', 'utf8');
console.log('generated go');