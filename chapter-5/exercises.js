
import R from 'ramda'
import accounting from 'accounting'
import _ from 'lodash'
import { expect } from 'chai'

// Helpers

const first = ary => ary[0]
const last = ary => ary[ary.length - 1]
const lower = x => x.toLowerCase()
const average = ary => (ary.reduce((sum, x) => sum + x, 0) / ary.length)

const add = R.curry((x, y) => y + x)
const prop = R.curry((x, obj) => obj[x])
const map = R.curry((fn, ary) => ary.map(fn))
const replace = R.curry((e, r, s) => _.replace(s, e, r))
const filter = R.curry((fn, ary) => ary.filter(fn))
const join = R.curry((x, ary) => ary.join(x))
const sortBy = R.curry((x, ary) => _.sortBy(ary, x))
const trace = x => {
  console.log(JSON.stringify(x, null, 4))
  return x
}

const underscore = replace(/\W+/g, `_`)

// Helper Tests

const data = [{ id: 1, is: true }, { id: 2, is: false }]
expect(filter(x => x.is, data)).to.eql([{ id: 1, is: true }])
expect(filter(x => !x.is, data)).to.eql([{ id: 2, is: false }])

expect(average([1,2,3,4,5])).to.equal(3)
expect(average([1,2,3,4])).to.equal(2.5)
expect(average([0])).to.equal(0)

expect(underscore(`jordan nieuwhof`)).to.equal(`jordan_nieuwhof`)

// Example Data
const CARS = [{
  name: `Ferrari FF`,
  horsepower: 660,
  dollar_value: 700000,
  in_stock: true,
}, {
  name: `Spyker C12 Zagato`,
  horsepower: 650,
  dollar_value: 648000,
  in_stock: false,
}, {
  name: `Jaguar XKR-S`,
  horsepower: 550,
  dollar_value: 132000,
  in_stock: false,
}, {
  name: `Audi R8`,
  horsepower: 525,
  dollar_value: 114200,
  in_stock: false,
}, {
  name: `Aston Martin One-77`,
  horsepower: 750,
  dollar_value: 1850000,
  in_stock: true,
}, {
  name: `Pagani Huayra`,
  horsepower: 700,
  dollar_value: 1300000,
  in_stock: false,
}]
const inStock = prop(`in_stock`);

// Exercise 1:
// ============
// Use _.compose() to rewrite the function below. Hint: _.prop() is curried.

const isLastInStock = R.compose(inStock, last)
expect(isLastInStock(CARS)).to.equal(false)
expect(isLastInStock(CARS.slice(0, 5))).to.equal(true)

// Exercise 2:
// ============
// Use _.compose(), _.prop() and _.head() to retrieve the name of the first car.

const nameOfFirstCar = R.compose(prop(`name`), first)
expect(nameOfFirstCar(CARS)).to.equal(`Ferrari FF`)

// Exercise 3:
// ============
// Use the helper function _average to refactor averageDollarValue as a composition.

const averageProperty = x => R.compose(average, map(prop(x)))

const averageDollarValue = averageProperty(`dollar_value`)
expect(averageDollarValue(CARS)).to.equal(790700)

const averageHorsepower = averageProperty(`horsepower`)
expect(Math.round(averageHorsepower(CARS))).to.equal(639)

// Exercise 4:
// ============
// Write a function: sanitizeNames() using compose that returns a list of lowercase and underscored car's names: e.g: sanitizeNames([{name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true}]) //=> ['ferrari_ff'].

const sanitizeNames = R.compose(map(lower), map(underscore), map(prop(`name`)))
const expected = [
  `ferrari_ff`,
  `spyker_c12_zagato`,
  `jaguar_xkr_s`,
  `audi_r8`,
  `aston_martin_one_77`,
  `pagani_huayra`,
]
expect(sanitizeNames(CARS)).to.eql(expected)

// Bonus 1:
// ============
// Refactor availablePrices with compose.

// var availablePrices = function(cars) {
//   var available_cars = _.filter(_.prop('in_stock'), cars);
//   return available_cars.map(function(x) {
//     return accounting.formatMoney(x.dollar_value);
//   }).join(', ');
// };

const availablePrices = R.compose(join(`,`), map(prop(`dollar_value`)), filter(inStock))
expect(availablePrices(CARS)).to.eql('700000,1850000')

// Bonus 2:
// ============
// Refactor to pointfree. Hint: you can use _.flip().

// var fastestCar = function(cars) {
//   var sorted = _.sortBy(function(car) {
//     return car.horsepower;
//   }, cars);
//   var fastest = _.last(sorted);
//   return fastest.name + ' is the fastest';
// };

const fastestCar = R.compose(add(` is the fastest`), prop(`name`), last, sortBy(`horsepower`))
expect(fastestCar(CARS)).to.eql(`Aston Martin One-77 is the fastest`)
