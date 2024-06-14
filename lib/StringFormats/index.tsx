export const StringFormats = {
  capitalizeFirstLetter: (string: string) => {
    if (!string) return null;
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  capitalizeFirstLetterOfEachWord: (string: string) => {
    if (!string) return null;
    return string?.replace(/\b\w/g, (char) => char.toUpperCase());
  },
};
