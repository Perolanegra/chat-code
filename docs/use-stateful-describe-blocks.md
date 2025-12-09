## Use `describe("when ...")` to model a state users can observe
For Example:
- "when logged in"
- "and fullscreen"
- "when navigation completes"

This keeps tests readable and sets clear expectations about setup and assertions.

## Arrange state in `beforeEach`
- Put the state’s setup inside that describe’s `beforeEach`.
- Interact with Mock services or spies (prefer the former)
- Avoid calling `detectChanges` in the top-level `beforeEach` if the unit under test has distinct initialization states and instead place this call inside a more focused `beforeEach` of an appropriate `describe` block that describes this state.

## Example
```ts
describe('when logged in', () => {
  beforeEach(() => {
    auth.isLoggedIn(true);
    fixture.detectChanges();
  });
});
```