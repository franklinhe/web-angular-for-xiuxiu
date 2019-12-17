export class LocalStorageSetTime {
  static time = 1000 * 60 * 60 * 25;
  static setItem(key: string, value: any) {
    var data = { value: value, expirse: new Date(new Date().getTime() + LocalStorageSetTime.time).getTime() };
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(key + '-copy', JSON.stringify(data));
  };
  static getItem(key: string) {
    var data = JSON.parse(localStorage.getItem(key));
    if (data !== null) {
      if (data.expirse != null && data.expirse < new Date().getTime()) {
        localStorage.removeItem(key);
      } else {
        return data.value;
      }
    }
    return null;
  }
}
