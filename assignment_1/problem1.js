// problem 1

const obj = {
  foo: { num: 2 },
  bar: { num: -1 },
  buz: { num: null },
  qux: {},
  quux: null,
};

function handleParse(obj) {
  let keys = Object.keys(obj);
  let returnValue = [];
  keys.map((key) => {
    let value = obj[key];
    if (
      !value ||
      typeof value != "object" ||
      value.num == undefined ||
      typeof value.num != "number"
    )
      return;
    returnValue.push(value);
  });

  return returnValue;
}

console.log(handleParse(obj));
