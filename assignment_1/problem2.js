// problem 2

const objList = [{ foo: 1 }, { bar: 2 }, { foo: -2 }, { foo: 3, bar: 4 }];

function handleParse(objList) {
  let returnValue = {};

  objList.map((obj) => {
    if (typeof obj != "object") return;
    Object.keys(obj).map((key) => {
      let value = obj[key];
      if (value == undefined || typeof value != "number") return;
      if (!returnValue[key]) returnValue[key] = value;
      else returnValue[key] += value;
    });
  });
  return returnValue;
}

console.log(handleParse(objList));
