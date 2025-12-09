# Never Violate Access Modifiers
To do so would be a violation of the core principle "test behavior not implementation"

## Example
```typescript
// ABSOLUTELY FORBIDDEN ❌
(component as any).privateProperty

// ABSOLUTELY FORBIDDEN ❌
component['privateProperty']

// ABSOLUTELY FORBIDDEN ❌
Object.defineProperty(component, 'privateProperty', {
    // anything
});
```