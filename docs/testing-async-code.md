# Testing Async Code

## Prefer the use of `fakeAsync` over `done()`
- `done()` is deprecated in later versions of jest/jasmine and is more susceptible to flakiness

## Keep `expect` statements out of subscriptions
```ts
    // CORRECT ✓
    let isBestPractice: boolean | null = null;
    service.selectIsBestPractice().pipe(
        take(1)
    ).subscribe({
        next: (output) => {
            isBestPractice = output
        }
    });
    tick();
    expect(isBestPractice).toEqual(true);
```

```ts
    // INCORRECT ❌
    service.selectIsBestPractice().subscribe((result) => { expect(result).toBe(false) });
    tick();
```

 