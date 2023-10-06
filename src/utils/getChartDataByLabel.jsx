export const getChartDataByLabel = (headers, formattedData) => {
  const namesArray = headers.reduce((acc, data) => {
    const countObject = formattedData.reduce((countAcc, item) => {
      const name = item[data];
      if (name && name.length > 0) {
        countAcc[name] = (countAcc[name] || 0) + 1;
      }
      return countAcc;
    }, {});
    acc[data] = countObject;
    return acc;
  }, {});

  const labels = Object.keys(namesArray);
  const datasets = [];

  Object.values(namesArray).map((data) => {
    datasets.push({
      label: Object.keys(data),
      data: Object.values(data)
    });
    return datasets;
  });

  const stackedData = labels.map((label, index) => ({
    label: datasets.map((dataset) => dataset.label[index]),
    data: datasets.map((dataset) => dataset.data[index])
  }));

  return [labels, stackedData];
};
