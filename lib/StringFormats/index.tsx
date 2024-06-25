export const StringFormats = {
  capitalizeFirstLetter: (string: string) => {
    if (!string) return null;
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  capitalizeFirstLetterOfEachWord: (string: string) => {
    if (!string) return null;
    return string?.replace(/\b\w/g, (char) => char.toUpperCase());
  },
  formatIntoTimeString: (time: number) => {
    if (time < 0) {
      return "00:00:00";
    }
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${seconds < 10 ? "00:" + "0" + seconds : "00:" + seconds}`;
  },
};
