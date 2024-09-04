import { Functor1 } from 'fp-ts/lib/Functor';
import { Kind, URIS } from 'fp-ts/lib/HKT';
import { pipe, flow } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray'; // Importing Functor for arrays from ReadonlyArray

// Define a generic curried map function for any Functor
// Given a Functor F, we return a function that we can use with pipe!
// Note will only work with functions of type constructor kind *->*
function curriedMap<F extends URIS>(
  functor: Functor1<F>
): <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B> {
  return <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => functor.map(fa, f);
}

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

// Define a function that doubles a number and appends "!" to the result
function doubleAndBang<F extends URIS>(
  functor: Functor1<F>,
  fa: Kind<F, number>
): Kind<F, string> {
  const myMap = curriedMap(functor);
  return pipe(
    fa,
    myMap(
      flow(
        (n: number) => n * 2,
        (n: number) => `${n}!`
      )
    )
  );
}

// Use with custom type X
const xValue: X<number> = { x: 2 };
const xRes = doubleAndBang(functorX, xValue);
console.log(xRes); // Output: { x: "4!" }

// Use with Array from fp-ts, now referred to as functorArray
const arrayValue: Array<number> = [1, 2, 3];
const arrayRes = doubleAndBang(RA.Functor, arrayValue);
console.log(arrayRes); // Output: ["2!", "4!", "6!"]
