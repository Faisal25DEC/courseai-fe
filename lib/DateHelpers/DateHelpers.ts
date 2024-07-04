import moment from "moment-timezone";

export const FormatDate = {
  getDateInDDMMYYYY: (value: any) => moment(value).format("DD MMM, YYYY"),
  formatMilliseconds: (ms: any) => {
    if (ms === 0) return "0 seconds";
    if (!ms) return null;
    const duration = moment.duration(ms);
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.minutes());
    const seconds = Math.floor(duration.seconds());

    let formattedTime = "";
    if (hours > 0) {
      formattedTime += `${hours} hrs, `;
    }
    if (minutes > 0) {
      formattedTime += `${minutes} min, `;
    }
    if (seconds > 0 || (hours === 0 && minutes === 0)) {
      formattedTime += `${seconds} sec`;
    }

    // Remove any trailing comma and space
    formattedTime = formattedTime.replace(/, $/, "");

    return formattedTime;
  },
  getDateAndTimeFromMilliseconds: (ms: any) => {
    return moment(ms).format("DD MMM, YYYY, hh:mm A");
  },
};
