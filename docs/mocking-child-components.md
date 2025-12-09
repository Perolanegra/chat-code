# Mocking Child Components
- Create mock components for all direct children
- Implement proper interfaces (e.g., ControlValueAccessor)
- Verify @Input properties are correctly passed
- Do not use `any` when typing fields on mock components where a typing could be applied based on the implementation of the child component being mocked.