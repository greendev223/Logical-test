// problem 2

// initial input values
const objList = [{foo: 1}, {bar: 2}, {foo: -2}, {foo: 3, bar: 4}]

let store={}
  _.map(objList , function(value) {
  		_.isObject(value)&&_.map(value, function(v,key){
  		_.isNumber(v) && (store[key] = _.has(store,key)?(store[key] + v) : v)
  		})
})

//result 
result = store