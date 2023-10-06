export const getUniqueKeys = (data) => {
  const keys = [];

  data.forEach((item) => {
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      }
    }
  });

  return keys;
};
