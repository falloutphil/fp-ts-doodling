import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';

// Step 1: Define the curried add function
// This curried function takes a number x and returns
// a function that takes another number y and returns their sum.
const add = (x: number) => (y: number): number => x + y;
const add3 = (x: number) => (y: number) => (z: number): number => x + y + z;

// Step 2: Wrap the add function in an Option functor
const addWrapped = O.some(add);
const addWrapped3 = O.some(add3);

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

const result2 = pipe(
    addWrapped3,    
    O.ap(O.some(10)),
    O.ap(O.some(6)),
    O.ap(O.some(3))
);

console.log(result2);  // Output: some(19)


// This is a more idiomatic approach using `sequenceT` from fp-ts.
// `sequenceT` takes a sequence of applicatives (in this case, `Option`s)
// and combines them into a single applicative that holds a tuple of their values.
//
// Here, we specify that we are working with `Option` by passing `O.option` to `sequenceT`.
// We then provide each `Option` instance (`O.some(10)`, `O.some(6)`, `O.some(3)`).
// These are our parameters to our function - just as before.
//
// `sequenceT(O.option)(O.some(10), O.some(6), O.some(3))` produces an `Option`
// that contains a tuple `[10, 6, 3]` if all provided `Option` instances are `Some`.
// If any of them were `None`, the result would be `None`.
//
// After combining the values, we use `O.map` to transform the tuple.
// The function inside `O.map` takes the tuple as a single parameter, which
// is destructured into `x`, `y`, and `z`. We then simply add these three values together.
//
// Remember: `O.map` expects a function of type `(a: A) => B`, which you provide.
// `sequenceT(O.option)` produces the `Option` containing the tuple `[10, 6, 3]`.
// `O.map` applies your function to this tuple, transforming it into a new `Option`,
// in this case, `Some(19)`.
//
// Note that the resulting operation does not need to be curried anymore,
// since we are working with the fully combined tuple at this point.
//
// Conceptually: The result of `sequenceT` in this context is a tuple `(10, 6, 3)`
// — a fixed collection of three elements.
// In TypeScript Code: This tuple is represented as an array `[10, 6, 3]`, but with
// a specific type indicating that it’s a tuple of exactly three numbers (`[number, number, number]`).
//
// All-or-Nothing Check: `sequenceT` checks all `Option`s at once. If all `Option` instances are `Some`,
// it proceeds to combine their values into a tuple. If any `Option` is `None`, the entire result is `None`.
//
// Think about it this way: With the `ap` approach, you are threading a sequence of parameters,
// checking that each one in turn is `Some(x)` and not `None`. If you get to the end and all parameters
// are `Some(x)`, then your function is fully parameterized, and you can compute your result.
// With `sequenceT`, you ignore the function at the end for now and simply check all the parameters.
// If they are all `Some(x)`, a single `Some([a, b, c])` is provided to a regular function via
// the functor's `map`, allowing for the calculation of the final result.
//
// The approaches are slightly different but achieve the same ends:
// - With `ap()`, you are building a calculation that will eventually be executed.
// - With `sequenceT`, you are building a sequence of parameters that will be mapped over a regular function.
const result2b = pipe(
    sequenceT(O.option)(O.some(10), O.some(6), O.some(3)),
    O.map(([x, y, z]) => x + y + z)
);

console.log(result2b);  // Output: some(19)
