import { ordNumber, ordString, fromCompare } from 'fp-ts/lib/Ord';
import { concatAll } from 'fp-ts/lib/Monoid';
import { Monoid as O, Ordering } from 'fp-ts/lib/Ordering';


// lengthCompare :: String -> String -> Ordering
// lengthCompare x y = (length x `compare` length y) `mappend`
//                     (vowels x `compare` vowels y) `mappend`
//                     (x `compare` y)
//     where vowels = length . filter (`elem` "aeiou")



// Utility function to count vowels in a string
const countVowels = (s: string): number =>
  s.split('').filter(c => 'aeiou'.indexOf(c.toLowerCase()) !== -1).length;

// Ord instance for comparing string lengths
const ordLength = fromCompare<string>((x, y) => 
  ordNumber.compare(x.length, y.length)
);

// Ord instance for comparing the number of vowels
const ordVowels = fromCompare<string>((x, y) => 
  ordNumber.compare(countVowels(x), countVowels(y))
);

// Combining the ordering using concatAll
const lengthCompare = (x: string, y: string): Ordering =>
  concatAll(O)([
    ordLength.compare(x, y),
    ordVowels.compare(x, y),
    ordString.compare(x, y),
  ]);

// Testing the lengthCompare function
console.log(lengthCompare('zen', 'ants')); // LT
console.log(lengthCompare('zen', 'ant'));  // GT
console.log(lengthCompare('zen', 'anna')); // LT
console.log(lengthCompare('zen', 'ana'));  // LT
console.log(lengthCompare('zen', 'ann'));  // GT
