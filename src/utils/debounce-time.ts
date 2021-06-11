export function debounceTime<T>(callback: (value: T) => void, millisecond: number): (value: T) => void {
  // eslint-disable-next-line no-undef
  let clearToken: NodeJS.Timeout | null = null;

  return (value: T) => {
    if (clearToken) {
      clearTimeout(clearToken);
    }
    clearToken = setTimeout(() => {
      callback(value);
    }, millisecond);
  };
}
