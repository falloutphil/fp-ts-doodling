import { Ord, fromCompare, contramap } from 'fp-ts/lib/Ord';
import { Monoid as O, Ordering } from 'fp-ts/lib/Ordering';
import { concatAll } from 'fp-ts/lib/Monoid';
import * as N from 'fp-ts/lib/number';
import * as S from 'fp-ts/lib/string';

// lengthCompare :: String -> String -> Ordering
// lengthCompare x y = (length x `compare` length y) `mappend`
//                     (vowels x `compare` vowels y) `mappend`
//                     (x `compare` y)
//     where vowels = length . filter (`elem` "aeiou")

// Utility function to count vowels in a string
const countVowels = (s: string): number =>
  s.split('').filter(c => 'aeiou'.indexOf(c.toLowerCase()) !== -1).length;

// Ord instance for comparing string lengths
const ordLength = contramap((s: string) => s.length)(N.Ord);

// Ord instance for comparing the number of vowels
const ordVowels = contramap((s: string) => countVowels(s))(N.Ord);

// Combining the ordering using concatAll
const lengthCompare = (x: string, y: string): Ordering =>
  concatAll(O)([
    ordLength.compare(x, y),
    ordVowels.compare(x, y),
    S.Ord.compare(x, y),
  ]);

// Testing the lengthCompare function
console.log(lengthCompare('zen', 'ants')); // LT
console.log(lengthCompare('zen', 'ant'));  // GT
console.log(lengthCompare('zen', 'anna')); // LT
console.log(lengthCompare('zen', 'ana'));  // LT
console.log(lengthCompare('zen', 'ann'));  // GT
