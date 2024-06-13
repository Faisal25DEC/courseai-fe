import moment from "moment-timezone";

export const FormatDate = {
  getDateInDDMMYYYY: (value: any) => moment(value).format("DD MMM, YYYY"),
};
