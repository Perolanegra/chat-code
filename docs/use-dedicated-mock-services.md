# Use Dedicated Mock Services
Our mock services follow a specific pattern that must be respected


## BehaviorSubject Properties
   - Mock services expose `BehaviorSubject` properties not apart of the interface they extend
   - These correspond to streams that are part of the interface the mock service extends
   - Example: `mockService._activeVersion` for the `selectActiveVersion()` stream
   - The mock service's BehaviorSubjects should only be used for setting up state, not for verifying behavior

   ```typescript
   // Correct way to set mock service state
   versionService._activeVersion.next(testActiveVersion);
   ```

## Method Spies
   - Use `spyOn` for mock service methods
   - Don't access methods with property syntax
   
   ```typescript
   // CORRECT ✓
   spyOn(compareService, 'updateVersionsForComparison');

   // CORRECT ✓
   jest.spyOn(compareService, 'updateVersionsForComparison');
   
   // INCORRECT ❌
   compareService.updateVersionsForComparison = jasmine.createSpy();
   ```

## Mock Providers
   - Always use the provided mock providers in TestBed setup instead of providing the service directly
   - Use the interface associated with the `provide` of the mock provider constant to inject the service, but then cast to the type of the Mock Service and assign to a variable so we can access the behavior subjects of the mock. 

   ```typescript
      let formulaService: MockFormulaService;
      let versionService: VersionsServiceMock;
      //...//

      beforeEach(
         waitForAsync(() => {
            TestBed.configureTestingModule({
               //...//
               providers: [
                  MOCK_FORMULA_SERVICE,
                  MOCK_VERSIONS_SERVICE
               ]
            }).compileComponents();
         })
      );

      beforeEach(() => {
         //...//
         formulaService = TestBed.inject(IFormulaService) as MockFormulaService;
         versionService = TestBed.inject(IVersionService) as VersionsServiceMock;
         //...//
      });
   ```