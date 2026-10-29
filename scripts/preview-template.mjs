// Runs PlanOption.figma.ts locally with sample property values and prints the snippet
// Dev Mode would show. A stand-in for `figma connect preview`, which needs an access token.
import { buildSync } from 'esbuild';

const code = buildSync({
  entryPoints: [new URL('../src/PlanOption.figma.ts', import.meta.url).pathname],
  bundle: false, write: false, format: 'cjs', platform: 'neutral', loader: { '.ts': 'ts' },
}).outputFiles[0].text;

function fakeFigma(props, tone) {
  const instance = {
    getString: (n) => props[n],
    getBoolean: (n) => props[n],
    getEnum: (n, map) => map[props[n]],
    findInstance: () => ({ type: 'INSTANCE', getEnum: (n, map) => map[tone] }),
  };
  const tsx = (strings, ...values) => strings.reduce((out, s, i) => out + s + (i < values.length ? values[i] : ''), '');
  return { selectedInstance: instance, tsx, code: tsx };
}

const cases = [
  ['Selected, recommended', { Title: 'On time', Detail: 'Ready by June', Amount: '€375', Recommended: true, State: 'Selected' }, 'Info'],
  ['Default', { Title: 'Relaxed', Detail: 'Ready by August, after your trip', Amount: '€300', Recommended: false, State: 'Default' }, 'Positive'],
  ['Disabled, over budget', { Title: 'Faster', Detail: 'More than you usually have left', Amount: '€600', Recommended: false, State: 'Disabled' }, 'Danger'],
];

for (const [label, props, tone] of cases) {
  const module = { exports: {} };
  const require = (name) => { if (name === 'figma') return fakeFigma(props, tone); throw new Error(name); };
  new Function('module', 'exports', 'require', code)(module, module.exports, require);
  const out = module.exports.default;
  console.log(`--- ${label}\n${out.imports.join('\n')}\n\n${out.example}\n`);
}
