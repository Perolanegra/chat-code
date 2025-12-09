# Use Material Design Harnesses

When testing components that use Angular Material, ALWAYS use the Material testing harnesses instead of direct DOM manipulation or event triggering.

```typescript
// ❌ WRONG - Don't do this
const select = fixture.debugElement.query(By.css('mat-select'));
select.triggerEventHandler('click', {});

// ✅ CORRECT - Do this instead
const select = await loader.getHarness(MatSelectHarness);
await select.open();
```

Harnesses provide:
- Proper handling of Material's overlay system
- Stable testing API that matches user interactions
- Automatic handling of async behavior
- Access to Material-specific features (e.g., `getTextErrors()` for form fields)

Import harnesses from `@angular/material/*/testing` and use `TestbedHarnessEnvironment.loader(fixture)` to get the loader.

> **Note:** When using Material harnesses, wrap your test in `fakeAsync(async () => { ... })` to properly handle both fake time and async operations. Use `tick()` after `fixture.detectChanges()` to advance the fake time. 