export const formatTimeWithSeconds = 
  (date: Date | number | string | undefined | null, 
    showTime: boolean = true, showSeconds: boolean = true): string => {
  if (date === undefined || date === null) {
    return "";
  }

  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  let result = `${year}-${month}-${day}`;
  if (showTime) {
    result += ` ${hours}:${minutes}`;

    if (showSeconds) {
        result += `:${seconds}`;
    }
  }

  return result;
}