// problem 1

// initial input values
const obj = {foo: {num: 2}, bar: {num: -1}, buz: {num: null}, qux: {}, quux: null}

// result
result = _.filter(obj,function(value,key){
       if (_.isObject(value) && _.has(value, 'num') && _.isNumber(value.num)) 
       return _.has(value,'num')
})


