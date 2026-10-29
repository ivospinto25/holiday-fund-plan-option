import { createContext, useContext, useId, type ReactNode } from 'react';
import type { Affordability } from './affordability';
import { formatEuros } from './formatEuros';

type BadgeTone = 'positive' | 'info' | 'warning' | 'danger' | 'ai';

// Affordability drives the badge, as the nested Badge does in Figma.
const BADGE: Record<Affordability, { tone: BadgeTone; label: string }> = {
  comfortable: { tone: 'positive', label: 'Comfortable' },
  balanced: { tone: 'info', label: 'Balanced' },
  tight: { tone: 'warning', label: 'Tight' },
  over: { tone: 'danger', label: 'Over budget' },
};

export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

interface GroupState {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const GroupContext = createContext<GroupState | null>(null);

export interface PlanOptionGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

// A fieldset of native radios: one option selected, arrow keys move between options.
export function PlanOptionGroup({ label, value, onChange, children }: PlanOptionGroupProps) {
  const name = useId();
  return (
    <fieldset className="plan-option-group">
      <legend className="plan-option-group__label">{label}</legend>
      <GroupContext.Provider value={{ name, value, onChange }}>{children}</GroupContext.Provider>
    </fieldset>
  );
}

export interface PlanOptionProps {
  /** Pace identifier, e.g. 'relaxed' | 'on-time' | 'faster'. */
  value: string;
  /** Figma: Title. */
  title: string;
  /** Figma: Amount, in whole euros. */
  monthlyAmount: number;
  /** Figma: Detail. */
  detail: string;
  /** Figma: Badge › Tone. 'over' also disables the option. */
  affordability: Affordability;
  /** Figma: Recommended. */
  recommended?: boolean;
  /** Figma: State=Disabled. */
  disabled?: boolean;
}

export function PlanOption({ value, title, monthlyAmount, detail, affordability, recommended, disabled }: PlanOptionProps) {
  const group = useContext(GroupContext);
  if (!group) throw new Error('PlanOption must be used inside PlanOptionGroup');
  const isDisabled = disabled || affordability === 'over';
  const badge = BADGE[affordability];

  return (
    <label className="plan-option" data-disabled={isDisabled || undefined}>
      <input
        type="radio"
        className="visually-hidden"
        name={group.name}
        value={value}
        checked={group.value === value}
        disabled={isDisabled}
        onChange={() => group.onChange(value)}
      />
      <span className="plan-option__radio" aria-hidden="true" />
      <span className="plan-option__main">
        <span className="plan-option__title-row">
          <span className="plan-option__title">{title}</span>
          {recommended && <Badge tone="ai">Recommended</Badge>}
        </span>
        <span className="plan-option__detail">{detail}</span>
      </span>
      <span className="plan-option__side">
        <span className="plan-option__amount">
          {formatEuros(monthlyAmount)}
          <span className="plan-option__per" aria-hidden="true">/mo</span>
          <span className="visually-hidden"> a month</span>
        </span>
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </span>
    </label>
  );
}
