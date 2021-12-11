export function setValue(k: string, value: any, expiredTime = -1) {
  const key = k.trim();
  const Metadata = {
    key: key,
    value: value,
    saveTime: new Date().getTime(),
    expiredTime: expiredTime,
  };
  window.localStorage.setItem(key, JSON.stringify(Metadata));
}

export function getValue(k: string) {
  const key = k.trim();
  const data = localStorage.getItem(key);
  if (data) {
    const { value, saveTime, expiredTime } = JSON.parse(data);
    if (expiredTime === -1) {
      return value;
    }
    const currentTime = new Date().getTime();
    if (currentTime > saveTime + expiredTime) {
      return value;
    }
    return undefined;
  }
  return undefined;
}

export function updateExpiredTime(k: string) {
  const key = k.trim();
  try {
    const data = window.localStorage.getItem(key);
    const Metadata = JSON.parse(data!);
    Metadata.saveTime = new Date().getTime();
    window.localStorage.setItem(key, JSON.stringify(Metadata));
  } catch (e) {}
}

export function removeValue(key: string) {
  window.localStorage.removeItem(key);
}
export function clearStorage() {
  window.localStorage.clear();
}
