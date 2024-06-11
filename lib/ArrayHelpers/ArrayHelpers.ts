export const getMaxId = (array: any) => {
  if (!array.length) return 0;

  let maxId = array[0].id;
  for (let i = 1; i < array.length; i++) {
    if (array[i].id > maxId) {
      maxId = array[i].id;
    }
  }
  return maxId;
};
