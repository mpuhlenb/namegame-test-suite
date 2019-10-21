# namegame-test-suite

## Installation
Pull down repository and from project root directory

```shell
npm run cypress:open
```
In the Cypress App click the homepagetests.spec.js file and it will begin running the tests

## Tests
Test files are located in ./cypress/integration

There are tests for:
- Name game title
- Who is contains name
- Attempts counter incrementing
- Streak counter incremementing on correct selections
- Streak counter reset after wrong selection
- All counters incrementing correctly
- Photos and names updating after correct photo selected
- Proper decorator and a name displayed with wrong photo selection
- Proper decorator and a name displayed with correct photo selection

## Utility functions
I placed a util.js file in integration folder as well. This houses a few functions to reuse code
- Clicks a correct photo
- Clicks a wrong photo
- Clicks correct photo x times to help create a streak


## Notes
I made 2 test set to fail as they could be considered incorrect grammar.
They have comments indicated which ones and can be updated to pass with simple change to text
