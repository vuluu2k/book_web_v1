export const camelize = str => str.replace(/_([a-z])/g, childstr => childstr[1].toUpperCase());

export function converObjToCamelKeys(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if ('' + key !== camelize('' + key)) {
        obj[camelize('' + key)] = obj[key];
        delete obj[key];
      }
    }
  }
  return obj;
}
