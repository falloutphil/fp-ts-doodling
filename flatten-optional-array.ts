import { pipe } from 'fp-ts/lib/function';
import { getMonoid as getArrayMonoid } from 'fp-ts/lib/Array';
import { getMonoid as getOptionMonoid, Option, some, none } from 'fp-ts/lib/Option';
import { concatAll } from 'fp-ts/lib/Monoid';

// Define a function to flatten an Array of Option<Array<A>>
function flattenedOption<A>(options: Array<Option<Array<A>>>): Option<Array<A>> {
  const arrayMonoid = getArrayMonoid<A>();
  const optionMonoid = getOptionMonoid(arrayMonoid);
  return pipe(options, concatAll(optionMonoid));
}

// Usage examples
const optionsArray1: Array<Option<Array<number>>> = [some([1, 2]), none, some([3, 4])];
const flattenedOptions1 = flattenedOption(optionsArray1);
console.log(flattenedOptions1); // Output: Some([1, 2, 3, 4])

const optionsArray2: Array<Option<Array<string>>> = [some(["foo", "bar"]), none, some(["baz"])];
const flattenedOptions2 = flattenedOption(optionsArray2);
console.log(flattenedOptions2); // Output: Some(["foo", "bar", "baz"])

const optionsArray3: Array<Option<Array<number>>> = [none, none, none];
const flattenedOptions3 = flattenedOption(optionsArray3);
console.log(flattenedOptions3); // Output: None
