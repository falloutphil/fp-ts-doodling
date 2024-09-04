// Importing necessary functions and types from fp-ts
import * as O from 'fp-ts/Option'; // Option is the equivalent of Maybe in Haskell
import { pipe } from 'fp-ts/function'; // Pipe for function composition

// Type aliases for birds and pole
type Birds = number;
type Pole = [Birds, Birds]; // A tuple representing birds on the left and right

/**
 * landLeft function
 * Haskell equivalent: landLeft :: Birds -> Pole -> Maybe Pole
 * Adds birds to the left side and checks balance; returns None if unbalanced
 */
const landLeft = (n: Birds) => (pole: Pole): O.Option<Pole> =>
  Math.abs((pole[0] + n) - pole[1]) < 4 ? O.some([pole[0] + n, pole[1]]) : O.none;

/**
 * landRight function
 * Haskell equivalent: landRight :: Birds -> Pole -> Maybe Pole
 * Adds birds to the right side and checks balance; returns None if unbalanced
 */
const landRight = (n: Birds) => (pole: Pole): O.Option<Pole> =>
  Math.abs(pole[0] - (pole[1] + n)) < 4 ? O.some([pole[0], pole[1] + n]) : O.none;

/**
 * Simulating a sequence of bird landings using flatMap
 * Mirrors Haskell's use of >>= to chain operations that might fail
 */
const landingSequence = pipe(
  O.some([0, 0]), // Start with an initial balanced pole in the Option context
  O.flatMap(landLeft(1)),   // First, land 1 bird on the left
  O.flatMap(landRight(4)),  // Then, land 4 birds on the right - boom!  Change to 3 to see success work!
  O.flatMap(landLeft(-1)),  // Next, one bird flies away from the left
  O.flatMap(landRight(-2))  // Finally, two birds fly away from the right
);

console.log('Landing sequence result:', landingSequence); // Should output: None if unbalanced

/**
 * banana function
 * Haskell equivalent: banana :: Pole -> Maybe Pole
 * Causes Pierre to fall by always returning None, representing failure
 */
const banana = (_: Pole): O.Option<Pole> => O.none;

/**
 * Simulating a failed sequence with banana
 * Shows how adding a guaranteed failure (banana) affects the chain
 */
const failedLanding = pipe(
  O.some([0, 0]),           // Start with a balanced pole
  O.flatMap(landLeft(1)),   // Land 1 bird on the left
  O.flatMap(banana),        // Banana function, guarantees failure
  O.flatMap(landRight(1))   // This step will never be reached
);

console.log('Failed sequence with banana:', failedLanding); // Should output: None

/**
 * Explanation:
 * 
 * - We use `flatMap` (analogous to Haskell's >>=) to chain operations that can fail.
 * - `flatMap` allows us to apply functions that return an Option (Maybe in Haskell) while
 *   maintaining the context of possible failure.
 * - If any step in the chain returns `None`, the entire chain fails, mirroring the 
 *   propagation of failure in Haskell's Maybe monad.
 * 
 * Changes from Haskell:
 * 
 * - Haskell uses the >>= operator for monadic chaining; in `fp-ts`, we use `flatMap`.
 * - Haskell uses `return` to wrap values in a context; in `fp-ts`, we use `O.some`.
 * - TypeScript requires more explicit handling of types (Pole vs. Option<Pole>).
 * - Function composition is done with `pipe` in `fp-ts`, similar to chaining in Haskell.
 */
