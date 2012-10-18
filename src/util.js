quandlism.util = {};

quandlism.util.formatData = function(data, color) {
  return color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.Date, num: +d[name]};
      })
    }
  });
}