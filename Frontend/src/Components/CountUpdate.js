
export const mapList = new Map();
function CountUpdate(count, idName) {
  if (count === 0)
    mapList.delete(idName);
  else {
    mapList.set(idName, count);
  }
}
export default CountUpdate;