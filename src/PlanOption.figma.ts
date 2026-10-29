// url=https://www.figma.com/design/FILE_KEY/Holiday-Fund?node-id=NODE_ID
// source=src/PlanOption.tsx
// component=PlanOption
import figma from 'figma'

// Code Connect template: what Dev Mode shows when someone inspects a Plan option instance.
// Replace FILE_KEY and NODE_ID with the link to the "Plan option" component set
// (right-click it in Figma → Copy link to selection).
const instance = figma.selectedInstance

const title = instance.getString('Title')
const detail = instance.getString('Detail')
const amount = instance.getString('Amount')
const recommended = instance.getBoolean('Recommended')
const state = instance.getEnum('State', { Default: 'default', Selected: 'selected', Disabled: 'disabled' })

// The affordability badge is an exposed nested instance; its Tone maps to the code prop.
const badge = instance.findInstance('badge')
const affordability = badge.type === 'INSTANCE'
  ? badge.getEnum('Tone', { Positive: 'comfortable', Info: 'balanced', Warning: 'tight', Danger: 'over' })
  : 'balanced'

// "€375" in Figma is a number in code; formatting happens in the component.
const monthlyAmount = Number(amount.replace(/[^0-9.]/g, '')) || 0
const value = title.toLowerCase().replace(/\s+/g, '-')

export default {
  example: figma.tsx`<PlanOption
  value="${value}"
  title="${title}"
  monthlyAmount={${monthlyAmount}}
  detail="${detail}"
  affordability="${affordability}"${recommended ? '\n  recommended' : ''}${state === 'disabled' ? '\n  disabled' : ''}
/>${state === 'selected' ? `\n{/* Selected: the parent PlanOptionGroup has value="${value}" */}` : ''}`,
  imports: ["import { PlanOption } from '@holiday-fund/ui'"],
  id: 'plan-option',
  metadata: {
    nestable: true,
  },
}
