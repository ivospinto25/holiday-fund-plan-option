import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PlanOption, PlanOptionGroup } from '../src/PlanOption';
import { getAffordability } from '../src/affordability';

const SURPLUS = 520; // what the customer usually has left each month

function Plan({ label, start, options }: { label: string; start: string; options: [string, string, number, string, boolean?][] }) {
  const [pace, setPace] = useState(start);
  return (
    <PlanOptionGroup label={label} value={pace} onChange={setPace}>
      {options.map(([value, title, amount, detail, recommended]) => (
        <PlanOption key={value} value={value} title={title} monthlyAmount={amount} detail={detail}
          affordability={getAffordability(amount, SURPLUS)} recommended={recommended} />
      ))}
    </PlanOptionGroup>
  );
}

createRoot(document.getElementById('nov')!).render(
  <Plan label="Choose a pace · start in November" start="on-time" options={[
    ['relaxed', 'Relaxed', 300, 'Ready by August, after your trip'],
    ['on-time', 'On time', 375, 'Ready by June', true],
    ['faster', 'Faster', 430, 'Ready by May'],
  ]} />,
);
createRoot(document.getElementById('jan')!).render(
  <Plan label="Choose a pace · start in January" start="on-time" options={[
    ['relaxed', 'Relaxed', 375, 'Ready by August, after your trip'],
    ['on-time', 'On time', 500, 'Ready by June'],
    ['faster', 'Faster', 600, 'More than you usually have left'],
  ]} />,
);
