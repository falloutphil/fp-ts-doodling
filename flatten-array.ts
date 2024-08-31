import { pipe } from 'fp-ts/lib/function';
import { getMonoid } from 'fp-ts/lib/Array';
import { concatAll } from 'fp-ts/lib/Monoid';

function flattened<A>(array: Array<Array<A>>): Array<A> {
  return pipe(array, concatAll(getMonoid<A>()));
}

// Usage
const numbersArray = [[1, 2], [4, 5]];
const flattenedNumbers = flattened(numbersArray);
console.log(flattenedNumbers); // Output: [1, 2, 4, 5]

const stringsArray = [["foo", "bar"], ["baz"]];
const flattenedStrings = flattened(stringsArray);
console.log(flattenedStrings); // Output: ["foo", "bar", "baz"]

