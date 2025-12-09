# Testing Behavior via Templates

1. **NEVER utilize `NO_ERRORS_SCHEMA`**
    - We must test Components as actual UI Components and not just as arbitrary TypeScript classes - otherwise we're simply not testing behavior.

2. **Interact with components through proper channels**
    - DOM events
    - Input bindings
    - Output subscriptions
    - Interactions with mocked dependencies

3. **Use reusable query functions for template elements**
    - Create descriptive functions for common element queries
    - Centralize complex selectors to improve maintainability
    - Make test intentions clearer through meaningful function names