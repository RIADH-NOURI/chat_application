import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";


dayjs.extend(isToday);

export const FormatTime = (timestamp: string) => {
    const date = dayjs(timestamp);
  
    if (date.isToday()) {
      return date.format("h:mm A"); // e.g. "2:30 PM"
    } else {
      return date.format("D MMMM"); // e.g. "8 May"
    }
  };