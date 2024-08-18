// option here is the instance of Functor1 (like Maybe a)
import { Option, some, none, map, option } from 'fp-ts/lib/Option';
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
// then takes a generic parameter A.  So F could be Maybe, A could be Int.
import { URIS, Kind } from 'fp-ts/lib/HKT';

// Example usage with Option
const someValue: Option<number> = some(5);
const noneValue: Option<number> = none;

// Using the map function provided by fp-ts specifically for Option
const incremented = pipe(
  someValue,
  map((x: number) => x + 1)
); // Option<number> -> Some(6)

const stillNone = pipe(
  noneValue,
  map((x: number) => x + 1)
); // Option<number> -> None

console.log(incremented); // Output: Some(6)
console.log(stillNone);   // Output: None

// Define a truly generic increment function that works with any Functor
function increment<F extends URIS>(functor: Functor1<F>, fa: Kind<F, number>): Kind<F, number> {
  return functor.map(fa, x => x + 1);
}

// Example usage with Option Functor
const incrementedWithGeneric = increment(option, someValue);

console.log(incrementedWithGeneric); // Output: Some(6)

// Generic lift function that works with any Functor
// TypeScript enforces that the provided value fa value matches
// the specified Functor instance F at compile time.
// So if fa is some(3), F must be option.
function lift<F extends URIS, A, B>(
  functor: Functor1<F>, 
  fa: Kind<F, A>, 
  f: (a: A) => B
): Kind<F, B> {
  return functor.map(fa, f);
}

// Example usage with Option Functor
const liftedOption = lift(option, someValue, (x: number) => x + 5);

console.log(liftedOption); // Output: Some(10)
