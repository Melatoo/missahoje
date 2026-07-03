Viewed SKILL.md:1-68

[
  {
    "location": "src/components/CitySelector.tsx:18",
    "trigger_condition": "API response missing items array",
    "guard_snippet": "setCidades((data.items || []).sort((a, b) => a.nome.localeCompare(b.nome)));",
    "potential_consequence": "Crash calling sort on undefined"
  },
  {
    "location": "src/components/CitySelector.tsx:68-80",
    "trigger_condition": "cidades list is empty after fetch",
    "guard_snippet": "{cidades.length === 0 && <li>Nenhuma cidade encontrada</li>}",
    "potential_consequence": "Shows empty dropdown with no feedback"
  },
  {
    "location": "src/components/MassSchedule.tsx:24-26",
    "trigger_condition": "getMissas API call throws an error",
    "guard_snippet": "setMissas([]);",
    "potential_consequence": "Displays previous day's schedule silently"
  },
  {
    "location": "src/components/MassSchedule.tsx:32-34",
    "trigger_condition": "time argument is null or undefined",
    "guard_snippet": "return time ? String(time).slice(0, 5) : '';",
    "potential_consequence": "Crash calling slice on undefined"
  },
  {
    "location": "src/components/NextMassCard.tsx:44",
    "trigger_condition": "paroquia or endereco is undefined",
    "guard_snippet": "encodeURIComponent((nextMass.paroquia?.nome || '') + ' ' + (nextMass.paroquia?.endereco || ''))",
    "potential_consequence": "Crash during Maps URL construction"
  }
]