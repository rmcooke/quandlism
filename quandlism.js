(function(exports) { 
(function() {
  var QuandlismContext, QuandlismContext_, QuandlismLine, quandlism, quandlism_axis, quandlism_brush, quandlism_id_ref, quandlism_line_id, quandlism_stage, quandlism_xaxis, quandlism_yaxis;

  quandlism = exports.quandlism = {
    version: '0.2.0'
  };

  quandlism.context = function() {
    var colorScale, context, dom, dombrush, domlegend, domstage, domtooltip, endPercent, event, h, lines, w,
      _this = this;
    context = new QuandlismContext();
    w = null;
    h = null;
    dom = null;
    domstage = null;
    dombrush = null;
    domlegend = null;
    domtooltip = null;
    endPercent = 0.8;
    event = d3.dispatch('respond', 'adjust', 'toggle', 'refresh');
    colorScale = d3.scale.category20();
    lines = [];
    context.attachData = function(lines_) {
      var brush, stage;
      lines = lines_;
      if (domstage) {
        stage = d3.select(domstage).datum(lines);
      }
      if (stage && stage.select('.x')) {
        stage.select('.x').datum(lines);
      }
      if (stage && stage.select('.y')) {
        stage.select('.y').datum(lines);
      }
      if (dombrush) {
        brush = d3.select(dombrush).datum(lines);
      }
      if (brush && brush.select('.x')) {
        brush.select('.x').datum(lines);
      }
      if (domlegend) {
        d3.select(domlegend).datum(lines);
      }
      return context;
    };
    context.render = function() {
      if (domstage) {
        d3.select(domstage).call(context.stage());
      }
      if (dombrush) {
        d3.select(dombrush).call(context.brush());
      }
      if (domlegend) {
        d3.select(domlegend).call(context.legend());
      }
      return context;
    };
    context.build = function() {
      w = $(dom).width();
      h = $(dom).height();
      return context;
    };
    context.lines = function(_) {
      if (!(_ != null)) {
        return lines;
      }
      lines = _;
      return context;
    };
    context.colorScale = function(_) {
      if (!(_ != null)) {
        return colorScale;
      }
      colorScale = _;
      return context;
    };
    context.endPercent = function(_) {
      if (!(_ != null)) {
        return endPercent;
      }
      endPercent = _;
      return context;
    };
    context.w = function(_) {
      if (!(_ != null)) {
        return w;
      }
      w = _;
      return context;
    };
    context.h = function(_) {
      if (!(_ != null)) {
        return h;
      }
      h = _;
      return context;
    };
    context.dom = function(_) {
      if (!(_ != null)) {
        return dom;
      }
      dom = _;
      return context;
    };
    context.domstage = function(_) {
      if (!(_ != null)) {
        return domstage;
      }
      domstage = _;
      return context;
    };
    context.dombrush = function(_) {
      if (!(_ != null)) {
        return dombrush;
      }
      dombrush = _;
      return context;
    };
    context.domlegend = function(_) {
      if (!(_ != null)) {
        return domlegend;
      }
      domlegend = _;
      return context;
    };
    context.domtooltip = function(_) {
      if (!(_ != null)) {
        return domtooltip;
      }
      domtooltip = _;
      return context;
    };
    context.respond = _.throttle(function() {
      return event.respond.call(context, 500);
    });
    context.adjust = function(x1, x2) {
      return event.adjust.call(context, x1, x2);
    };
    context.toggle = function() {
      return event.toggle.call(context);
    };
    context.refresh = function() {
      return event.refresh.call(context);
    };
    context.on = function(type, listener) {
      if (!(listener != null)) {
        return event.on(type);
      }
      event.on(type, listener);
      return context;
    };
    d3.select(window).on('resize', function() {
      var h0, w0;
      d3.event.preventDefault();
      if (dom) {
        w0 = $(dom).width();
        h0 = $(dom).height();
        if (w !== w0 || h !== h0) {
          w = w0;
          h = h0;
          context.respond();
        }
      }
    });
    return context;
  };

  QuandlismContext = (function() {

    function QuandlismContext() {}

    return QuandlismContext;

  })();

  QuandlismContext_ = QuandlismContext.prototype = quandlism.context.prototype;

  quandlism_axis = 0;

  quandlism_line_id = 0;

  quandlism_id_ref = 0;

  quandlism_stage = {
    w: 0.87,
    h: 0.60
  };

  quandlism_brush = {
    w: 0.87,
    h: 0.10
  };

  quandlism_xaxis = {
    w: 0.87,
    h: 0.15
  };

  quandlism_yaxis = {
    w: 0.12,
    h: 0.60
  };

  QuandlismLine = (function() {

    function QuandlismLine() {}

    return QuandlismLine;

  })();

  QuandlismContext_.line = function(data) {
    var context, id, line, name, values, visible,
      _this = this;
    line = new QuandlismLine(context);
    context = this;
    name = data.name;
    values = data.values.reverse();
    id = quandlism_line_id++;
    visible = true;
    line.extent = function(start, end) {
      var i, max, min, n, val;
      i = start != null ? start : 0;
      n = end != null ? end : this.length() - 1;
      min = Infinity;
      max = -Infinity;
      if (!this.visible()) {
        return [min, max];
      }
      while (i <= n) {
        val = this.valueAt(i);
        if (!(val != null)) {
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
    };
    line.length = function() {
      return values.length;
    };
    line.valueAt = function(i) {
      if (values[i] != null) {
        return values[i].num;
      } else {
        return null;
      }
    };
    line.dateAt = function(i) {
      if (values[i] != null) {
        return values[i].date;
      } else {
        return null;
      }
    };
    line.drawPoint = function(color, ctx, xS, yS, index, radius) {
      if (this.visible()) {
        ctx.beginPath();
        ctx.arc(xS(index), yS(this.valueAt(index)), radius, 0, Math.PI * 2, true);
        ctx.fillStyle = color;
        ctx.fill();
        return ctx.closePath();
      }
    };
    line.drawPath = function(color, ctx, xS, yS, start, end, lineWidth) {
      var i, _i;
      if (this.visible()) {
        ctx.beginPath();
        for (i = _i = start; start <= end ? _i <= end : _i >= end; i = start <= end ? ++_i : --_i) {
          ctx.lineTo(xS(i), yS(this.valueAt(i)));
        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
        return ctx.closePath();
      }
    };
    line.toggle = function() {
      var v;
      v = !this.visible();
      this.visible(v);
      return v;
    };
    line.id = function(_) {
      if (!(_ != null)) {
        return id;
      }
      id = _;
      return line;
    };
    line.name = function(_) {
      if (!(_ != null)) {
        return name;
      }
      name = _;
      return line;
    };
    line.values = function(_) {
      if (!(_ != null)) {
        return values;
      }
      values = _;
      return line;
    };
    line.visible = function(_) {
      if (!(_ != null)) {
        return visible;
      }
      visible = _;
      return line;
    };
    return line;
  };

  QuandlismContext_.stage = function() {
    var canvas, canvasId, context, ctx, extent, height, lines, padding, stage, threshold, width, xAxis, xEnd, xScale, xStart, yAxis, yScale,
      _this = this;
    context = this;
    canvasId = null;
    lines = [];
    width = Math.floor(context.w() * quandlism_stage.w);
    height = Math.floor(context.h() * quandlism_stage.h);
    xScale = d3.scale.linear();
    yScale = d3.scale.linear();
    xAxis = null;
    yAxis = null;
    padding = 10;
    extent = [];
    xStart = null;
    xEnd = null;
    threshold = 10;
    canvas = null;
    ctx = null;
    stage = function(selection) {
      var clearTooltip, draw, drawTooltip, lineHit;
      lines = selection.datum();
      canvasId = "canvas-stage-" + (++quandlism_id_ref);
      if (!(yAxis != null)) {
        yAxis = selection.append('div');
        yAxis.datum(lines);
        yAxis.attr('height', context.h() * quandlism_yaxis.h);
        yAxis.attr('width', context.w() * quandlism_yaxis.w);
        yAxis.attr('class', 'axis y');
        yAxis.attr('id', "y-axis-" + canvasId);
        yAxis.call(context.yaxis().orient('left'));
      }
      canvas = selection.append('canvas');
      canvas.attr('width', width);
      canvas.attr('height', height);
      canvas.attr('class', 'stage');
      canvas.attr('id', canvasId);
      ctx = canvas.node().getContext('2d');
      if (!(xAxis != null)) {
        xAxis = selection.append('div');
        xAxis.datum(lines);
        xAxis.attr('width', context.w() * quandlism_xaxis.w);
        xAxis.attr('height', context.h() * quandlism_xaxis.h);
        xAxis.attr('class', 'x axis');
        xAxis.attr('id', "x-axis-" + canvasId);
        xAxis.call(context.xaxis().active(true));
      }
      xStart = !xStart ? Math.floor(lines[0].length() * context.endPercent()) : xStart;
      xEnd = !xEnd ? lines[0].length() : xEnd;
      draw = function(lineId) {
        var i, j, line, lineWidth, _i, _j, _len;
        extent = context.utility().getExtent(lines, xStart, xEnd);
        yScale.domain([extent[0], extent[1]]);
        yScale.range([height - padding, padding]);
        xScale.domain([xStart, xEnd]);
        xScale.range([padding, width - padding]);
        ctx.clearRect(0, 0, width, height);
        lineId = lineId != null ? lineId : -1;
        for (j = _i = 0, _len = lines.length; _i < _len; j = ++_i) {
          line = lines[j];
          lineWidth = j === lineId ? 3 : 1.5;
          if (xEnd - xStart <= threshold) {
            line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, xStart, xEnd, lineWidth);
            for (i = _j = xStart; xStart <= xEnd ? _j <= xEnd : _j >= xEnd; i = xStart <= xEnd ? ++_j : --_j) {
              line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, i, 3);
            }
          } else if (xEnd === xStart) {
            line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, xStart, 3);
          } else {
            line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, xStart, xEnd, lineWidth);
          }
        }
      };
      lineHit = function(m) {
        var hex, hitMatrix, i, j, k, n, _i, _j, _k, _ref, _ref1, _ref2, _ref3, _ref4;
        hex = context.utility().getPixelRGB(m, ctx);
        i = _.indexOf(context.colorScale().range(), hex);
        if (i !== -1) {
          return {
            x: m[0],
            color: hex,
            line: lines[i]
          };
        }
        hitMatrix = [];
        for (j = _i = _ref = m[0] - 3, _ref1 = m[0] + 3; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; j = _ref <= _ref1 ? ++_i : --_i) {
          for (k = _j = _ref2 = m[1] - 3, _ref3 = m[1] + 3; _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; k = _ref2 <= _ref3 ? ++_j : --_j) {
            if (j !== m[0] || k !== m[1]) {
              hitMatrix.push([j, k]);
            }
          }
        }
        for (n = _k = 0, _ref4 = hitMatrix.length - 1; 0 <= _ref4 ? _k <= _ref4 : _k >= _ref4; n = 0 <= _ref4 ? ++_k : --_k) {
          hex = context.utility().getPixelRGB(hitMatrix[n], ctx);
          i = _.indexOf(context.colorScale().range(), hex);
          if (i !== -1) {
            return {
              x: hitMatrix[n][0],
              color: hex,
              line: lines[i]
            };
          }
        }
        return false;
      };
      drawTooltip = function(x, line, hex) {
        var pointSize;
        $(context.domtooltip()).html("<span style='color: " + hex + ";'>" + (line.name()) + "</span>: " + (context.utility().formatNumberAsString(line.valueAt(x))) + "  on " + (line.dateAt(x)));
        draw(line.id());
        pointSize = xEnd - xStart <= threshold ? 5 : 3;
        line.drawPoint(hex, ctx, xScale, yScale, x, pointSize);
      };
      clearTooltip = function() {
        $(context.domtooltip()).text('');
        draw();
      };
      draw();
      context.on('respond.stage', function() {
        ctx.clearRect(0, 0, width, height);
        width = Math.floor(context.w() * quandlism_stage.w);
        height = Math.floor(context.h() * quandlism_stage.h);
        canvas.attr('width', width);
        canvas.attr('height', height);
        draw();
      });
      context.on('adjust.stage', function(x1, x2) {
        xStart = x1 > 0 ? x1 : 0;
        xEnd = lines[0].length() > 2 ? x2 : lines[0].length() - 1;
        draw();
      });
      context.on('toggle.stage', function() {
        draw();
      });
      context.on('refresh.stage', function() {
        lines = selection.datum();
        xEnd = lines[0].length();
        xStart = Math.floor(lines[0].length() * context.endPercent());
        draw();
      });
      if (context.domtooltip() != null) {
        d3.select("#" + canvasId).on('mousemove', function(e) {
          var hit;
          hit = lineHit(d3.mouse(this));
          if (hit !== false) {
            return drawTooltip(Math.round(xScale.invert(hit.x)), hit.line, hit.color);
          } else {
            return clearTooltip();
          }
        });
      }
    };
    stage.padding = function(_) {
      if (!(_ != null)) {
        return padding;
      }
      padding = _;
      return stage;
    };
    stage.canvasId = function(_) {
      if (!(_ != null)) {
        return canvasId;
      }
      canvasId = _;
      return stage;
    };
    stage.width = function(_) {
      if (!(_ != null)) {
        return width;
      }
      width = _;
      return stage;
    };
    stage.height = function(_) {
      if (!(_ != null)) {
        return height;
      }
      height = _;
      return stage;
    };
    stage.xScale = function(_) {
      if (!(_ != null)) {
        return xScale;
      }
      xScale = _;
      return stage;
    };
    stage.yScale = function(_) {
      if (!(_ != null)) {
        return yScale;
      }
      yScale = _;
      return stage;
    };
    stage.xEnd = function(_) {
      if (!(_ != null)) {
        return xEnd;
      }
      xEnd = _;
      return stage;
    };
    stage.xStart = function(_) {
      if (!(_ != null)) {
        return xStart;
      }
      xStart = _;
      return stage;
    };
    stage.threshold = function(_) {
      if (!(_ != null)) {
        return threshold;
      }
      threshold = _;
      return stage;
    };
    return stage;
  };

  QuandlismContext_.brush = function() {
    var activeHandle, brush, brushWidth, brushWidth0, canvas, canvasId, context, ctx, dragging, extent, handleWidth, height, height0, lines, stretchLimit, stretchMin, stretching, threshold, touchPoint, width, width0, xAxis, xScale, xStart, xStart0, yScale,
      _this = this;
    context = this;
    height = context.h() * quandlism_brush.h;
    height0 = height;
    width = context.w() * quandlism_brush.w;
    width0 = width;
    brushWidth = Math.ceil(width * 0.2);
    brushWidth0 = brushWidth;
    handleWidth = 10;
    xStart = width * context.endPercent();
    xStart0 = xStart;
    xScale = d3.scale.linear();
    yScale = d3.scale.linear();
    canvas = null;
    ctx = null;
    xAxis = null;
    canvasId = null;
    extent = [];
    lines = [];
    threshold = 10;
    dragging = false;
    stretching = false;
    stretchLimit = 6;
    stretchMin = 0;
    activeHandle = 0;
    touchPoint = null;
    brush = function(selection) {
      var clearCanvas, dispatchAdjust, draw, drawBrush, resetState, setScales, update;
      lines = selection.datum();
      canvasId = "canvas-brush-" + (++quandlism_id_ref);
      canvas = selection.append('canvas').attr('width', width).attr('height', height).attr('class', 'brush').attr('id', canvasId);
      ctx = canvas.node().getContext('2d');
      if (!(xAxis != null)) {
        xAxis = selection.append('div');
        xAxis.datum(lines);
        xAxis.attr('class', 'x axis');
        xAxis.attr('width', context.w() * quandlism_xaxis.w);
        xAxis.attr('height', context.h() * quandlism_xaxis.h);
        xAxis.attr('id', "x-axis-" + canvasId);
        xAxis.call(context.xaxis());
      }
      setScales = function() {
        extent = context.utility().getExtent(lines, null, null);
        yScale.domain([extent[0], extent[1]]);
        yScale.range([height, 0]);
        xScale.domain([0, lines[0].length() - 1]);
        xScale.range([0, width]);
        stretchMin = Math.floor(xScale(stretchLimit));
      };
      update = function() {
        clearCanvas();
        draw();
        drawBrush();
      };
      clearCanvas = function() {
        ctx.clearRect(0, 0, width0, height0);
        canvas.attr('width', width).attr('height', height);
      };
      draw = function() {
        var j, line, showPoints, _i, _len;
        showPoints = lines[0].length() <= threshold;
        for (j = _i = 0, _len = lines.length; _i < _len; j = ++_i) {
          line = lines[j];
          line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, 0, lines[0].length(), 1);
          if (showPoints) {
            line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, j, 2);
          }
        }
      };
      drawBrush = function() {
        ctx.strokeStyle = 'rgba(207, 207, 207, 0.55)';
        ctx.beginPath();
        ctx.fillStyle = 'rgba(207, 207, 207, 0.55)';
        ctx.fillRect(xStart, 0, brushWidth, height);
        ctx.lineWidth = 1;
        ctx.lineTo(xStart, height);
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#CFCFCF';
        ctx.fillRect(xStart - handleWidth, 0, handleWidth, height);
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#CFCFCF';
        ctx.fillRect(xStart + brushWidth, 0, handleWidth, height);
        ctx.closePath();
      };
      dispatchAdjust = function() {
        var x1, x2;
        x1 = xScale.invert(xStart);
        x2 = xScale.invert(xStart + brushWidth);
        context.adjust(Math.ceil(x1), Math.ceil(x2));
      };
      resetState = function() {
        dragging = false;
        stretching = false;
        activeHandle = 0;
        xStart0 = xStart;
        brushWidth0 = brushWidth;
      };
      setScales();
      dispatchAdjust();
      setInterval(update, 50);
      context.on("respond.brush", function() {
        height0 = height;
        width0 = width;
        height = context.h() * quandlism_brush.h;
        width = context.w() * quandlism_brush.w;
        xStart = Math.ceil(xStart / width0 * width);
        xStart0 = Math.ceil(xStart0 / width0 * width);
        setScales();
      });
      context.on('refresh.brush', function() {
        lines = selection.datum();
        xStart = Math.ceil(width * context.endPercent());
        xStart0 = xStart;
        brushWidth = Math.ceil(width * 0.2);
        brushWidth0 = brushWidth;
        setScales();
      });
      context.on("toggle.brush", function() {
        setScales();
      });
      canvas.on('mousedown', function(e) {
        var m;
        d3.event.preventDefault();
        m = d3.mouse(this);
        touchPoint = m[0];
        if (m[0] >= (xStart - handleWidth) && m[0] < xStart) {
          stretching = true;
          activeHandle = -1;
        } else if (m[0] > (xStart + brushWidth) && m[0] <= (xStart + brushWidth + handleWidth)) {
          stretching = true;
          activeHandle = 1;
        } else if (m[0] <= (brushWidth + xStart) && m[0] >= xStart) {
          dragging = true;
        }
      });
      canvas.on('mouseup', function(e) {
        resetState();
      });
      canvas.on('mouseout', function(e) {
        resetState();
      });
      return canvas.on('mousemove', function(e) {
        var dragDiff, m;
        m = d3.mouse(this);
        if (dragging || stretching) {
          if (dragging) {
            xStart = xStart0 + (m[0] - touchPoint);
          } else {
            if (activeHandle !== 0 && activeHandle !== (-1) && activeHandle !== 1) {
              throw "Error: Unknown stretching direction";
            }
            dragDiff = m[0] - touchPoint;
            brushWidth = activeHandle === -1 ? brushWidth0 - dragDiff : brushWidth0 + dragDiff;
            if (activeHandle === -1) {
              xStart = xStart0 + dragDiff;
            }
            if (brushWidth <= stretchMin) {
              if (activeHandle === -1) {
                xStart = xStart + (brushWidth - stretchMin);
              }
              brushWidth = stretchMin;
            }
          }
          dispatchAdjust();
        }
      });
    };
    brush.xAxis = function(_) {
      if (!(_ != null)) {
        return xAxis;
      }
      xAxis = _;
      return brush;
    };
    brush.threshold = function(_) {
      if (!(_ != null)) {
        return threshold;
      }
      threshold = _;
      return brush;
    };
    brush.stretchLimit = function(_) {
      if (!(_ != null)) {
        return stretchLimit;
      }
      stretchLimit = _;
      return brush;
    };
    brush.handleWidth = function(_) {
      if (!(_ != null)) {
        return handleWidth;
      }
      handleWidth = _;
      return brush;
    };
    return brush;
  };

  QuandlismContext_.xaxis = function() {
    var active, axis_, context, extent, height, id, lines, parseDate, scale, width, xaxis,
      _this = this;
    context = this;
    width = context.w() * quandlism_xaxis.w;
    height = context.h() * quandlism_xaxis.h;
    scale = d3.time.scale().range([0, width]);
    axis_ = d3.svg.axis().scale(scale);
    extent = [];
    active = false;
    lines = [];
    id = null;
    parseDate = null;
    xaxis = function(selection) {
      var changeScale, update;
      id = selection.attr('id');
      lines = selection.datum();
      axis_.tickSize(5, 3, 0);
      update = function() {
        var g;
        xaxis.remove();
        g = selection.append('svg');
        g.attr('width', width);
        g.attr('height', height);
        g.append('g');
        g.attr('transform', 'translate(0, 27)');
        return g.call(axis_);
      };
      changeScale = function() {
        extent = [lines[0].dateAt(0), lines[0].dateAt(lines[0].length() - 1)];
        parseDate = context.utility().parseDate(lines[0].dateAt(0));
        scale.domain([parseDate(extent[0]), parseDate(extent[1])]);
        axis_.tickFormat(d3.time.format('%b %d, %Y'));
        axis_.ticks(Math.floor(width / 150, 0, 0));
        return scale.range([0, width]);
      };
      changeScale();
      update();
      context.on("respond.xaxis-" + id, function() {
        width = context.w() * quandlism_xaxis.w;
        axis_.ticks(Math.floor(width / 150, 0, 0));
        scale.range([0, width]);
        return update();
      });
      context.on("refresh.xaxis-" + id, function() {
        lines = selection.datum();
        changeScale();
        return update();
      });
      if (active) {
        context.on("adjust.xaxis-" + id, function(x1, x2) {
          x2 = x2 > lines[0].length() - 1 ? lines[0].length() - 1 : x2;
          x1 = x1 < 0 ? 0 : x1;
          extent = [lines[0].dateAt(x1), lines[0].dateAt(x2)];
          scale.domain([parseDate(extent[0]), parseDate(extent[1])]);
          return update();
        });
      }
    };
    xaxis.remove = function() {
      return d3.select("#" + id).selectAll("svg").remove();
    };
    xaxis.active = function(_) {
      if (!_) {
        return active;
      }
      active = _;
      return xaxis;
    };
    return d3.rebind(xaxis, axis_, 'orient', 'ticks', 'ticksSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
  };

  QuandlismContext_.yaxis = function() {
    var axis_, context, extent, height, id, lines, scale, width, xEnd, xStart, yaxis,
      _this = this;
    context = this;
    width = context.w() * quandlism_yaxis.w;
    height = context.h() * quandlism_yaxis.h;
    scale = d3.scale.linear().range([height, 0]);
    axis_ = d3.svg.axis().scale(scale);
    lines = [];
    extent = [];
    xStart = null;
    xEnd = null;
    id = null;
    yaxis = function(selection) {
      var setEndPoints, update;
      id = selection.attr('id');
      lines = selection.datum();
      axis_.ticks(Math.floor(height / 50, 0, 0));
      axis_.tickSize(5, 3, 0);
      update = function() {
        var a, g;
        extent = context.utility().getExtent(lines, xStart, xEnd);
        scale.domain([extent[0], extent[1]]);
        yaxis.remove();
        g = selection.append('svg');
        g.attr('width', width);
        g.attr('height', '100%');
        a = g.append('g');
        a.attr('transform', "translate(" + (width - 1) + ", 0)");
        a.attr('width', width);
        a.attr('height', height);
        return a.call(axis_);
      };
      setEndPoints = function() {
        xEnd = lines[0].length() - 1;
        xStart = Math.floor(lines[0].length() * context.endPercent());
      };
      setEndPoints();
      update();
      context.on("toggle.y-axis-" + id, function() {
        update();
      });
      context.on("refresh.y-axis-" + id, function() {
        lines = selection.datum();
        setEndPoints();
        update();
      });
      context.on("respond.y-axis-" + id, function() {
        width = context.w() * quandlism_yaxis.w;
        height = context.h() * quandlism_yaxis.h;
        axis_.ticks(Math.floor(height / 50, 0, 0));
        scale.range([height, 0]);
        update();
      });
      context.on("adjust.y-axis-" + id + "}", function(x1, x2) {
        xStart = x1 > 0 ? x1 : 0;
        xEnd = x2 < lines[0].length() ? x2 : lines[0].length();
        update();
      });
    };
    yaxis.remove = function(_) {
      d3.select("#" + id).selectAll("svg").remove();
    };
    return d3.rebind(yaxis, axis_, 'orient', 'ticks', 'ticksSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
  };

  QuandlismContext_.legend = function() {
    var context, legend, legend_, lines;
    context = this;
    legend_ = null;
    lines = [];
    legend = function(selection) {
      var _this = this;
      lines = selection.datum();
      selection.selectAll('li').remove();
      legend_ = selection.selectAll('li').data(lines).enter().append('li').append('a').attr('href', 'javascript:;').attr('data-line-id', function(line) {
        return line.id();
      }).attr('style', function(line) {
        return "background-color: " + (context.utility().getColor(line.id()));
      }).text(function(line) {
        return line.name();
      });
      context.on("refresh.legend", function() {
        return lines = selection.datum();
      });
      return selection.selectAll('a').on("click", function(d, i) {
        var e, el, id;
        e = d3.event;
        el = e.target;
        id = el.getAttribute('data-line-id');
        e.preventDefault();
        if (lines[id] != null) {
          if (lines[id].toggle() === false) {
            $(el).addClass('off').attr("style", 'background-color: none;');
          } else {
            $(el).removeClass('off').attr("style", "background-color: " + (context.utility().getColor(id)));
          }
          context.toggle();
        }
      });
    };
    return legend;
  };

  QuandlismContext_.utility = function() {
    var context, utility,
      _this = this;
    context = this;
    utility = function() {};
    utility.createLines = function(data) {
      var i, keys, line, lineData, lines, _i, _len;
      keys = data.columns.slice(1);
      lineData = _.map(keys, function(key, i) {
        return _.map(data.data, function(d) {
          return {
            date: d[0],
            num: +d[i + 1]
          };
        });
      });
      if (!context.lines().length) {
        lines = _.map(keys, function(key, i) {
          return context.line({
            name: key,
            values: lineData[i]
          });
        });
      } else {
        lines = context.lines();
        for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
          line = lines[i];
          line.values(lineData[i].reverse());
        }
      }
      return lines;
    };
    utility.getExtent = function(lines, start, end) {
      var exes, line;
      exes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          _results.push(line.extent(start, end));
        }
        return _results;
      })();
      return [
        d3.min(exes, function(m) {
          return m[0];
        }), d3.max(exes, function(m) {
          return m[1];
        })
      ];
    };
    utility.getColor = function(i) {
      var s;
      s = context.colorScale();
      return s(i);
    };
    utility.formatNumberAsString = function(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    utility.getPixelRGB = function(m, ctx) {
      var px, rgb;
      px = ctx.getImageData(m[0], m[1], 1, 1).data;
      rgb = d3.rgb(px[0], px[1], px[2]);
      return rgb.toString();
    };
    utility.dateFormat = function(date) {
      var dateString, hyphenCount;
      hyphenCount = date.split('-').length - 1;
      switch (hyphenCount) {
        case -1:
          dateString = '%Y';
          break;
        case 2:
          dateString = '%Y-%m-%d';
          break;
        default:
          throw "Unknown date format: " + hyphenCount + " " + date;
      }
      return dateString;
    };
    utility.parseDate = function(date) {
      var dateString;
      dateString = this.dateFormat(date);
      return d3.time.format(dateString).parse;
    };
    return utility;
  };

}).call(this);

 })(this);