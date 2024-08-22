import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

// Step 1: Define the curried add function
// This curried function takes a number x and returns
// a function that takes another number y and returns their sum.
const add = (x: number) => (y: number): number => x + y;

// Step 2: Wrap the add function in an Option functor
const addWrapped = O.some(add);

// Step 3: Apply the function to Option values using ap, respecting the curried nature of ap
// 
// ap: <A>(fa: Option<A>) => <B>(fab: Option<(a: A) => B>) => Option<B>
// 
// So ap takes an applicative containing a value, and a function which takes 2 parameters (addWrapped)
// We partially apply addWrapped to the container which results in
// A NEW WRAPPED FUNCTION of (addWrapped(3))
// This is piped into to the 2nd ap which gives ap(some(5), addWrapper(3)) = Some(8)
// 
// The key point is that the first O.ap(O.some(3)) returns a function expecting addWrapped.
// When addWrapped is provided, the result is an Option containing a partially applied function
// that is then passed to O.ap(O.some(5)).
// 
// ap takes an applicative containing a value and returns a function that expects
// an applicative containing a function (which is curried, meaning it can be
// applied to one argument at a time).
// the function in the applicative is itself curried, accepting one argument
// at a time, and as such will apply the value contained within the applicative
// which will either yield a result, or a new function which itself will need
// to be applied to another ap() and so on....
// ap's curried nature allows it to work seamlessly in the pipe function,
// where each step in the chain receives the output from the previous step,
// maintaining the correct application order.
// 
// The important point here is addWrapped and ap must both be curried.
// addWrapped must be curried so it presents an interface that requires
// a single number some(3) and can return a new function addWrapped(3)
// We could extend this to a curried function with any number if parameters,
// just by adding more applications of ap() for each curried parameter.
// ap() itself must be curried so that it can take the applicative containing a value
// and return a function that will accept the applicative containing a function,
// which is exactly what pipe will provide it.
//
// It's somewhat easier to see in Haskell - because + is curried as standard
// and <*> is left-associative:
// pure (+) <*> Just 3 <*> Just 5
//
// When O.ap(O.some(3)) is applied in the pipe chain, it returns a function that
// then consumes addWrapped and partially applies O.some(3) to addWrapped,
// resulting in a new Option containing a partially applied function,
// which like addWrapped is passed on to O.ap(O.some(5)).
// The chain stops here and the function is fully applied after apply some(5)
// giving us some(8) as the answer.
// 
const result = pipe(
  addWrapped,              // Start with the wrapped function
  O.ap(O.some(3)),         // Apply to the first Option (x = 3)
  O.ap(O.some(5))          // Apply to the second Option (y = 5)
);

console.log(result);  // Output: some(8)
