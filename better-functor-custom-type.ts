import { array as functorArray } from 'fp-ts/lib/Array'; // Importing array as functorArray
import { Functor1 } from 'fp-ts/lib/Functor';
import { Kind, URIS } from 'fp-ts/lib/HKT';
import { pipe } from 'fp-ts/lib/function';

// Define the custom type X
type X<A> = {
  x: A;
};

// Extend the URIs to include X
// The LHS X is just a string literal 'X' in TypeScript!
declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    X: X<A>;
  }
}

// Define a URI constant for X
const URI = 'X' as const;
type URI = typeof URI;

// Implement the Functor instance for X
const functorX: Functor1<URI> = {
  URI,
  map: <A, B>(fa: X<A>, f: (a: A) => B): X<B> => ({ x: f(fa.x) }),
};

// Define a generic map function that works with any Functor
function genericMap<F extends URIS, A, B>(
  functor: Functor1<F>, 
  fa: Kind<F, A>, 
  f: (a: A) => B
): Kind<F, B> {
  return functor.map(fa, f);
}

// Define a function that doubles a number and appends "!" to the result
function doubleAndBang<F extends URIS>(
  functor: Functor1<F>,
  fa: Kind<F, number>
): Kind<F, string> {
  return pipe(
    fa,
    (fa) => genericMap(functor, fa, (n) => n * 2),
    (fa) => genericMap(functor, fa, (s) => `${s}!`)
  );
}

// Use with custom type X
const xValue: X<number> = { x: 2 };
const xRes = doubleAndBang(functorX, xValue);
console.log(xRes); // Output: { x: "4!" }

// Use with Array from fp-ts, now referred to as functorArray
const arrayValue: Array<number> = [1, 2, 3];
const arrayRes = doubleAndBang(functorArray, arrayValue);
console.log(arrayRes); // Output: ["2!", "4!", "6!"]
