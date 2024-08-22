import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

// Step 1: Define the curried add function
const add = (x: number) => (y: number): number => x + y;

// Step 2: Wrap the add function in an Option functor
const addWrapped = O.some(add);

// Step 3: Apply the function to Option values using ap, respecting the curried nature of ap
const result = pipe(
  addWrapped,              // Start with the wrapped function
  O.ap(O.some(3)),         // Apply to the first Option (x = 3)
  O.ap(O.some(5))          // Apply to the second Option (y = 5)
);

console.log(result);  // Output: some(8)
