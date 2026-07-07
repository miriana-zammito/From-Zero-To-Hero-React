# Codice Fiscale Field — Async Zod Validation

## Context

Add async validation to the Codice Fiscale field in the insurance wizard Step 1 (Anagrafici). Currently the field only has sync Zod checks (length=16, regex). Need: mock API call, debounce, spinner, green checkmark, error display, onBlur mode.

## Files to Create (3)

### 1. `src/services/codiceFiscaleService.ts`
Mock API for CF validation. Async function with 1-1.5s simulated delay.

```typescript
export interface CodiceFiscaleResult { valid: boolean; message?: string; }

export async function checkCodiceFiscale(cf: string): Promise<CodiceFiscaleResult> {
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
  // Deterministic mock rules
  if (cf === "RSSMRA80A01H501U") return { valid: true };
  if (cf === "AAAAAA00A00A000A") return { valid: false, message: "CF non trovato nell'anagrafe tributaria" };
  if (cf === "ZZZZZZ00Z00Z000Z") throw new Error("Servizio di verifica CF non disponibile");
  return Math.random() > 0.2
    ? { valid: true }
    : { valid: false, message: "CF non corrisponde ai dati anagrafici" };
}
```

### 2. `src/features/insurance/components/CodiceFiscaleField.module.css`
Styles for: `.inputWrapper` (relative container), `.statusIcon` (absolute right inside input), `.spinner` (border-circle with animation), `.check` (green checkmark), `.inputSuccess` (green border).

### 3. `src/features/insurance/components/CodiceFiscaleField.tsx`
Self-contained component:

- **State:** `cfStatus: 'idle' | 'verifying' | 'verified' | 'error'`
- **Watch:** `useWatch<InsuranceFormData>({ name: "anagrafici.codiceFiscale" })`
- **Debounce:** existing `useDebounce(fieldValue, 400)`
- **Effect:** when debounced value changes + length 16 → set `verifying`, call `trigger("anagrafici.codiceFiscale")`, on resolve check `getFieldState("anagrafici.codiceFiscale")` for errors → set `verified` or `error`
- **Effect:** when raw fieldValue changes → reset `verified`/`error` to `idle`
- **Render:** wrapper div, label, inputWrapper with input + status icon overlay, error paragraph
- Uses shared classes from `StepForm.module.css` (`.field`, `.label`, `.input`, `.error`)

## Files to Modify (4)

### 4. `src/services/index.ts`
Add: `export { checkCodiceFiscale } from "./codiceFiscaleService";`

### 5. `src/features/insurance/schemas/insuranceSchema.ts`
Add `.superRefine(async ...)` to `codiceFiscale` field in `anagraficiSchema`:
- Guard: skip if length !== 16 or regex fails (already caught by sync checks)
- Call `checkCodiceFiscale(val)`, catch network errors
- Add issue via `ctx.addIssue({ code: ZodIssueCode.custom, message })` if invalid

### 6. `src/features/insurance/components/StepAnagrafici.tsx`
Replace raw CF `<div className={s.field}>...</div>` block with `<CodiceFiscaleField />`.

### 7. `src/features/insurance/index.ts`
Add: `export { CodiceFiscaleField } from "./components/CodiceFiscaleField";`

## Data Flow

```
User types CF → useWatch catches value → useDebounce(400ms)
  → debounced value changes & length=16 → setStatus('verifying')
  → trigger("anagrafici.codiceFiscale")
    → zodResolver runs insuranceFormSchema
      → sync checks pass
      → async superRefine → checkCodiceFiscale() mock API
    → trigger resolves with boolean
  → check formState errors:
    → no error → setStatus('verified'), show ✓ green
    → error → setStatus('error'), show error text
```

## Key Notes

- Use relative imports (project convention, no `@/` alias used despite config)
- `verbatimModuleSyntax: true` → use `import type` for type-only imports
- CSS: input needs `padding-right: 2.25rem` to avoid text/icon overlap (add in CodiceFiscaleField.module.css)
- Spinner: CSS border animation using `--color-primary`
- Green check: unicode `✓` or SVG, color `--color-success`
- RHF mode stays `"onTouched"` (wizard-level) — CF async validation debounce prevents spam

## Verification

1. `npx tsc -b` — typecheck
2. `npm run build` — Vite build
3. Manual test in browser:
   - Type `RSSMRA80A01H501U` → wait → see spinner → green ✓
   - Type `AAAAAA00A00A000A` → wait → error message from API
   - Type `ZZZZZZ00Z00Z000Z` → wait → network error message
   - Type short value → sync error shows immediately, no spinner
   - Erase after success → green check disappears
4. Step navigation: fill all fields → click Avanti → step advances only after CF async validation completes
