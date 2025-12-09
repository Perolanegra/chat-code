# Clean Test Style
- Use descriptive test names and meaningful variables
- Keep structure implicit instead of adding "Arrange/Act/Assert" comments

## Use comments to add "because" statements
- Do this for test that benefit from explanations of their expectations.

``` ts
// CORRECT ✓
// because the value was supplied
expect(myValue).toBeDefined();
```

``` ts
  // INCORRECT ❌
expect(myValue).toBeDefined("because value was supplied");
```

## Keep each test focused
- One behavior per `it`. Avoid mixing unrelated concerns.