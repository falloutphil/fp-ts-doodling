// option here is the instance of Functor1 (like Maybe a)
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { Functor1 } from 'fp-ts/lib/Functor';
// URIS are the string literal names of kinds in typescript
// So things like Maybe a - if I just wanna talk about Maybe
// I can't do that because we can separate the generic from
// the container class like in haskell so we give each
// higher kinded type a URI to refer to itself on its own!
// Kind<F,number> is like any Functor which is specialised with a number
// so could refer to any type constructor F which can take a Number
// Kind<F,A> is even more generic - any type constructor F which
// then takes a generic parameter A. So F could be Maybe, A could be Int.
import { URIS, Kind } from 'fp-ts/lib/HKT';
import { getApplySemigroup } from 'fp-ts/lib/Apply';
import { SemigroupSum } from 'fp-ts/lib/number';

// Example usage with Option
const someValue: O.Option<number> = O.some(5);
const noneValue: O.Option<number> = O.none;

// Using the map function provided by fp-ts specifically for Option
const incremented = pipe(
  someValue,
  O.map((x: number) => x + 1)
); // Option<number> -> Some(6)

const stillNone = pipe(
  noneValue,
  O.map((x: number) => x + 1)
); // Option<number> -> None

console.log(incremented); // Output: Some(6)
console.log(stillNone);   // Output: None

// Define a truly generic increment function that works with any Functor
// Functor1 is the typeclass interface that defines the functor's behavior
function increment<F extends URIS>(functor: Functor1<F>, fa: Kind<F, number>): Kind<F, number> {
  // Use the functor's map method to increment the value inside
  return functor.map(fa, x => x + 1);
}

// Example usage with Option Functor using the modern approach
// Instead of directly using the option's map, we're passing the Functor instance
const incrementedWithGeneric = increment(O.Functor, someValue);

console.log(incrementedWithGeneric); // Output: Some(6)

// Generic lift function that works with any Functor
// lift takes a functor instance, a functor value, and a function to map over the value inside the functor
// TypeScript enforces that the provided value fa matches the specified Functor instance F at compile time.
// So if fa is some(3), F must be Option.
function lift<F extends URIS, A, B>(
  functor: Functor1<F>, 
  fa: Kind<F, A>, 
  f: (a: A) => B
): Kind<F, B> {
  // Map over the functor value fa using the provided function f
  return functor.map(fa, f);
}

// Example usage with Option Functor using the modern approach
const liftedOption = lift(O.Functor, someValue, (x: number) => x + 5);

console.log(liftedOption); // Output: Some(10)

// Example of combining Option<number> using getApplySemigroup
// getApplySemigroup combines Option values using a Semigroup operation,
// which is a common alternative to using map in certain contexts.

// getApplySemigroup leverages O.Apply to create a semigroup for Option<number>
// by lifting the semigroup operation of number (SemigroupSum) into the Option context.
// Essentially, it combines the capabilities of O.Apply and SemigroupSum to define how
// Some values are combined (+ via SemigroupSum) and how None values are managed
// (i.e., None short-circuits the operation).

// This is kinda like the general case of:
// const result = liftA2(Apply)(SemigroupSum.concat)(some(2), some(3));  // Some(5)
// But it returns a reusable semigroup for any Option type:
const semigroup = getApplySemigroup(O.Apply)(SemigroupSum);
// This semigroup allows us to combine two Option values where both need to be Some for a result
const combined = semigroup.concat(O.some(2), O.some(3)); // Some(5)
// If either is None, the result is None
const combinedWithNone = semigroup.concat(O.some(2), O.none); // None

console.log(combined); // Output: Some(5)
console.log(combinedWithNone); // Output: None
