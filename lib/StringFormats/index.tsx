export const StringFormats = {
  capitalizeFirstLetter: (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  capitalizeFirstLetterOfEachWord: (string: string) => {
    return string.replace(/\b\w/g, (char) => char.toUpperCase());
  },
};
