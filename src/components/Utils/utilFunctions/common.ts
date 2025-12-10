export const formatDateStr = (
  date: Date | number | string | undefined | null,
  showTime: boolean = true,
  showSeconds: boolean = true
): string => {
  if (date == null) {
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

export const formatMinutesStr = (
  minutes: number
) => {
  const minuteInt = Math.floor(minutes);
  const secondInt = Math.floor((minutes % 1) * 60);

  return `${String(minuteInt).padStart(2, '0')}:${String(secondInt).padStart(2, '0')}`;
}

export const roundTo2 = (num: number) => {
  return Math.round(num * 100) / 100;
}
