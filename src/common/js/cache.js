const SEAECH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 10;

function insertArry(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function getStorage(){
  if(window.sessionStorage){
    return sessionStorage.getItem(SEAECH_KEY)?sessionStorage.getItem(SEAECH_KEY).split(','):[];

  }else{
    alert('对不起，您的浏览器不支持本地缓存');
  }
}
export function setStorage(query){
  let searches = getStorage()?getStorage():[];
  console.log(searches);
  insertArry(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH);
  console.log(searches);
  sessionStorage.setItem(SEAECH_KEY, searches.join(','));
  return searches
}
export function clearStorage(){
  sessionStorage.clear();
}
