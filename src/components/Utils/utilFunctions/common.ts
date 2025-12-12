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

export const getCSSVariable = (cssVariable: string) => {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(cssVariable)
      .trim()
  )
}

export const getDataColorSet = () => {
  return [
    getCSSVariable("--chart-data-color-1"),
    getCSSVariable("--chart-data-color-2"),
    getCSSVariable("--chart-data-color-3"),
    getCSSVariable("--chart-data-color-4"),
    getCSSVariable("--chart-data-color-5"),
    getCSSVariable("--chart-data-color-6"),
    getCSSVariable("--chart-data-color-7"),
    getCSSVariable("--chart-data-color-8"),
    getCSSVariable("--chart-data-color-9"),
    getCSSVariable("--chart-data-color-10"),
  ]
}

export const hexToRgba = (hex: string, alpha: number = 1) => {
    hex = hex.toLowerCase();

    if (!hex.startsWith("#")) {
        throw Error("The hex should start with #");
    }

    hex = hex.replace('#', '');

    if (hex.length !== 3 && hex.length !== 6) {
        throw Error("The length of the hex is not qualified");
    }

    const hexStringRegex =/^([0-9]|[a-f])+$/
    if (hex.match(hexStringRegex) == null) {
        throw Error("The hex does not match heximal");
    }

    if (alpha < 0 || alpha > 1) {
        throw Error("The alpha should between 0 and 1");
    }

    alpha = Math.round(alpha * 10) / 10;

    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}