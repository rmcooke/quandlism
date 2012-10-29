/**
 * Quandlism Line
 */
function QuandlismLine(context) {
  this.context = context;
}
var QuandlismLine_ = QuandlismLine.prototype;

quandlism.line = QuandlismLine;

QuandlismLine_.valueAt = function() {
  return NaN;
}

QuandlismLine_.extent = function(start, end) {
  var i = 0, 
  n = this.length() -1, 
  min = Infinity, 
  max = -Infinity,
  val;
  if (start != null) {
    i = start;
  }
  if (end != null) {
    n = end;
  }
  while (i <= n) {
    val = this.valueAt(i);
    if (typeof(val) == 'undefined') {
      i++;
      continue;
    }
    if (val < min) {
      min = val;
    }
    if (val > max) {
      max = val;
    }
    i++;
  }
  return [min, max];
}

QuandlismContext_.line = function(data) {
  var context = this,
  line = new QuandlismLine(context),
  name = data.name,
  values = data.values.reverse(),
  id = ++quandlism_id,
  step = 10,
  visible = true,
  canvas = null;
    
  
  function prepare() {
    
  }
  
  /**
   * Draws a single point on the focus stage.
   *
   * color - The fill color of the circle
   * ctx - The HTML canvas elmenet to draw on
   * xS - Scale function for x axis
   * yS - Scale function for y axis
   * index - The data index for the point
   */
  line.drawPoint = function(color, ctx, xS, yS, index) {
    ctx.beginPath();
    ctx.arc(xS(index), yS(this.valueAt(index)), 5, 0, Math.PI*2, true);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
  
  /**
   * Draws the canvas path on the focus or brush chart
   *
   * color  - The hex color code of the line
   * ctx - The HTML canavs element to draw on
   * xS - The D3 scale for the xAxis
   * yS - The D3 scale for the yAxis
   * start - The first x-index to draw
   * end - The last x-index to draw
   *
   * Return nil
   */
  line.drawPath = function(color, ctx, xS, yS, start, end) {

    ctx.beginPath();
    for (i = start; i <= end; i++) {
      ctx.lineTo(xS(i), yS(this.valueAt(i)));
    }  
    ctx.strokeStyle = color;
    ctx.stroke();
    
    ctx.closePath();
  }
  
  line.startDate = function() {
    return values[0].date;
  }
  
  line.endDate = function() {
    return values[this.length() - 1].date;
  }
  
  line.valueAt = function(i) {
    if (typeof(values[i]) === 'undefined') {
      return null;
    } else {
      return values[i].num;
    }
  }
  
  line.values = function() {
    return values;
  }
  
  
  line.length = function() {
    return values.length;
  }
  
  line.visible = function(_) {
    if (!arguments.length) {
      return visible;
    }
    visible = _;
    return line;
  }
  
  line.canvas = function(_) {
    if (!arguments.length) {
      return canvas;
    }
    canvas = _;
    return line;
  }
  
  return line;
}


