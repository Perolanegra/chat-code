# Use Mock Builders
Always check for a mock builder when instantiating objects with a number of properties in tests, but do not generate new mock builders unless prompted to do so

## Naming
Mock builders follow the naming pattern `{Name}MockBuilder`, for example:
- when creating `IFormula` instances use `FormulaMockBuilder`
- when creating `

## Location
- MockBuilders are generally located in the corresponding module/domain's `mock` NX library
- Some exceptions include mock builders provided by the `shared/testing-utils` library

## Best Practices
- Prefer to use builder methods only for properties actually used
- Don't use builder methods to set values that are already applied as defaults by the builder

## AG Grid Mock Builders
- All AG Grid testing objects (params, nodes, etc.) have dedicated mock builders in `shared/testing-utils`

## Benefits of MockBuilders
1. They ensure all required properties are properly initialized
2. They maintain type safety
3. They adapt to interface changes automatically
4. They produce consistent test objects

## Examples
```typescript
// CORRECT ✓
const testFormula = new FormulaMockBuilder('id-123')
    .withName('Test Formula')
    .withTarget('Target', { Enabled: true })
    .build();

// INCORRECT ❌
const testFormula = {
    Id: 'id-123',
    Name: 'Test Formula',
    // Missing required properties
} as IFormula;
```