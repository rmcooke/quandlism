(function(exports) { 
(function() {
  var QuandlismContext, QuandlismContext_, QuandlismLine, quandlism, quandlism_axis, quandlism_brush, quandlism_id_ref, quandlism_line_id, quandlism_stage, quandlism_xaxis, quandlism_yaxis_width,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  quandlism = exports.quandlism = {
    version: '0.5.2'
  };

  quandlism.context = function() {
    var colorList, context, dom, dombrush, domlegend, domstage, domtooltip, event, h, lines, padding, startPoint, w,
      _this = this;
    context = new QuandlismContext();
    w = null;
    h = null;
    dom = null;
    domstage = null;
    dombrush = null;
    domlegend = null;
    domtooltip = null;
    padding = 0;
    startPoint = 0.70;
    event = d3.dispatch('respond', 'adjust', 'toggle', 'refresh');
    colorList = ['#e88033', '#4eb15d', '#c45199', '#6698cb', '#6c904c', '#e9563b', '#9b506f', '#d2c761', '#4166b0', '#44b1ae'];
    lines = [];
    context.attachData = function(lines_) {
      var i, line, _i, _len;
      context.addColorsIfNecessary(lines_);
      for (i = _i = 0, _len = lines_.length; _i < _len; i = ++_i) {
        line = lines_[i];
        line.color(colorList[i]);
      }
      lines = lines_;
      if (domstage) {
        d3.select(domstage).datum(lines);
      }
      if (dombrush) {
        d3.select(dombrush).datum(lines);
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
    context.chart = function(container, brush_) {
      var brush, brushId, stageId;
      if (!container.length) {
        throw 'Invalid container';
      }
      brush = brush_ != null ? brush_ : true;
      container.children().remove();
      if (!(container.attr('id') != null)) {
        container.attr('id', "quandlism-" + (++quandlism_id_ref));
      }
      dom = "#" + (container.attr('id'));
      stageId = "quandlism-stage-" + (++quandlism_id_ref);
      container.append("<div class='stage' id='" + stageId + "'></div>");
      domstage = "#" + stageId;
      if (brush) {
        brushId = "quandlism-brush-" + (++quandlism_id_ref);
        container.append("<div class='brush' id='" + brushId + "'></div>");
        dombrush = "#" + brushId;
      }
      return context;
    };
    context.withLegend = function(container) {
      if (!container.length) {
        throw 'Invalid container';
      }
      if (!container.attr('id')) {
        container.attr('id', "quandlism-legend-" + (++quandlism_id_ref));
      }
      domlegend = "#" + (container.attr('id'));
      return context;
    };
    context.setupWithContainer = function(container, brush_) {
      return context.chart(container, brush_);
    };
    context.legendWithSelector = function(container) {
      return context.withLegend(container);
    };
    context.addColorsIfNecessary = function(lines_) {
      var brightness, colorsNeeded, i, rgb;
      colorsNeeded = lines_.length - colorList.length;
      if (colorsNeeded < 0) {
        return;
      }
      brightness = 0.1;
      i = 0;
      while (i < colorsNeeded) {
        rgb = d3.rgb(colorList[i]).brighter(brightness);
        colorList.push(rgb.toString());
        i++;
      }
    };
    context.lines = function(_) {
      if (!_) {
        return lines;
      }
      lines = _;
      return context;
    };
    context.colorList = function(_) {
      if (!(_ != null)) {
        return colorList;
      }
      colorList = _;
      return context;
    };
    context.startPoint = function(_) {
      if (!(_ != null)) {
        return startPoint;
      }
      startPoint = _;
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
    context.padding = function(_) {
      if (!(_ != null)) {
        return padding;
      }
      padding = _;
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

  quandlism_yaxis_width = 40;

  quandlism_xaxis = {
    h: 0.10
  };

  quandlism_brush = {
    h: 0.15
  };

  quandlism_stage = {
    h: 0.65
  };

  QuandlismLine = (function() {

    function QuandlismLine() {}

    return QuandlismLine;

  })();

  QuandlismContext_.line = function(data) {
    var color, context, id, line, name, values, visible,
      _this = this;
    line = new QuandlismLine();
    context = this;
    name = data.name;
    values = data.values.reverse();
    id = quandlism_line_id++;
    visible = true;
    color = '#000000';
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
    line.extentByDate = function(startDate, endDate) {
      var date, i, max, min, val, _i, _len, _ref;
      min = Infinity;
      max = -Infinity;
      if (!this.visible()) {
        return [min, max];
      }
      _ref = this.dates();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        date = _ref[i];
        if (!(date <= endDate && date >= startDate)) {
          continue;
        }
        val = this.valueAt(i);
        if (val < min) {
          min = val;
        }
        if (val > max) {
          max = val;
        }
      }
      return [min, max];
    };
    line.dates = function(start, end) {
      var v, _i, _len, _ref, _results;
      _ref = values.slice(start, end + 1 || 9e9);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _results.push(v.date);
      }
      return _results;
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
    line.drawPoint = function(ctx, xS, yS, index, radius) {
      if (this.visible()) {
        if (this.valueAt(index) == null) {
          return;
        }
        ctx.beginPath();
        ctx.arc(xS(index), yS(this.valueAt(index)), radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color();
        ctx.fill();
        return ctx.closePath();
      }
    };
    line.drawPath = function(ctx, xS, yS, dateStart, dateEnd, lineWidth, drawPoints, stage) {
      var date, i, _i, _len, _ref;
      if (!this.visible()) {
        return;
      }
      if (drawPoints) {
        data = [];
      }
      stage = stage != null ? stage : false;
      ctx.beginPath();
      _ref = this.dates();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        date = _ref[i];
        if (!this.valueAt(i)) {
          continue;
        }
        if (!stage) {
          if (!(date <= dateEnd && date >= dateStart)) {
            continue;
          }
        }
        if (drawPoints) {
          data.push({
            date: date,
            value: this.valueAt(i)
          });
        }
        ctx.lineTo(xS(date), yS(this.valueAt(i)));
      }
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = this.color();
      ctx.stroke();
      ctx.closePath();
      if (drawPoints) {
        this.drawPoints(ctx, xS, yS, data);
      }
    };
    line.drawPoints = function(ctx, xS, yS, data) {
      var obj, _i, _len, _results;
      if (!this.visible()) {
        return;
      }
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        obj = data[_i];
        ctx.beginPath();
        ctx.arc(xS(obj.date), yS(obj.value), 3, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color();
        ctx.fill();
        _results.push(ctx.closePath());
      }
      return _results;
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
    line.color = function(_) {
      if (!(_ != null)) {
        return color;
      }
      color = _;
      return line;
    };
    return line;
  };

  QuandlismContext_.timeScale = function() {
    var context, scale;
    context = this;
    return scale = d3.time.scale();
  };

  QuandlismContext_.stage = function() {
    var canvas, canvasId, context, ctx, dateEnd, dateStart, drawEnd, drawStart, extent, height, line, lines, stage, threshold, width, xAxis, xScale, yAxis, yScale,
      _this = this;
    context = this;
    canvasId = null;
    lines = [];
    line = null;
    width = Math.floor(context.w() - quandlism_yaxis_width - 2);
    height = Math.floor(context.h() * quandlism_stage.h);
    xScale = d3.time.scale();
    yScale = d3.scale.linear();
    xAxis = d3.svg.axis().orient('bottom').scale(xScale);
    yAxis = d3.svg.axis().orient('left').scale(yScale);
    extent = [];
    dateStart = null;
    dateEnd = null;
    drawStart = null;
    drawEnd = null;
    threshold = 10;
    canvas = null;
    ctx = null;
    stage = function(selection) {
      var clearTooltip, draw, drawAxis, drawGridLines, drawTooltip, lineHit, setScales, xAxisDOM, yAxisDOM;
      if (!(canvasId != null)) {
        canvasId = "canvas-stage-" + (++quandlism_id_ref);
      }
      lines = selection.datum();
      line = _.first(lines);
      selection.attr("style", "position: absolute; left: 0px; top: 0px;");
      yAxisDOM = selection.insert('svg');
      yAxisDOM.attr('class', 'y axis');
      yAxisDOM.attr('id', "y-axis-" + canvasId);
      yAxisDOM.attr('width', quandlism_yaxis_width);
      yAxisDOM.attr('height', Math.floor(context.h() * quandlism_stage.h));
      yAxisDOM.attr("style", "position: absolute; left: 0px; top: 0px;");
      canvas = selection.append('canvas');
      canvas.attr('width', width);
      canvas.attr('height', height);
      canvas.attr('class', 'stage');
      canvas.attr('id', canvasId);
      canvas.attr('style', "position: absolute; left: " + quandlism_yaxis_width + "px; top: 0px;");
      ctx = canvas.node().getContext('2d');
      xAxisDOM = selection.append('svg');
      xAxisDOM.attr('class', 'x axis');
      xAxisDOM.attr('id', "x-axis-" + canvasId);
      xAxisDOM.attr('width', Math.floor(context.w() - quandlism_yaxis_width));
      xAxisDOM.attr('height', Math.floor(context.h() * quandlism_xaxis.h));
      xAxisDOM.attr('style', "position: absolute; left: " + quandlism_yaxis_width + "px; top: " + (context.h() * quandlism_stage.h) + "px");
      yAxis.tickSize(5, 3, 0);
      setScales = function() {
        var unitsObj;
        extent = context.utility().getExtentFromDates(lines, dateStart, dateEnd);
        if (extent[0] === extent[1]) {
          extent = context.utility().getExtent(lines, 0, line.length());
        }
        yScale.domain([extent[0], extent[1]]);
        yScale.range([height - context.padding(), context.padding()]);
        yAxis.ticks(Math.floor(context.h() * quandlism_stage.h / 30));
        yAxis.tickSize(5, 3, 0);
        unitsObj = context.utility().getUnitAndDivisor(Math.round(extent[1]));
        yAxis.tickFormat(function(d) {
          var n;
          n = (d / unitsObj['divisor']).toFixed(2);
          n = n.replace(/0+$/, '');
          n = n.replace(/\.$/, '');
          return "" + n + " " + unitsObj['label'];
        });
        xScale.domain([dateStart, dateEnd]);
        xScale.range([context.padding(), width - context.padding()]);
      };
      drawAxis = function() {
        var xg, yg;
        yAxisDOM.selectAll('*').remove();
        yg = yAxisDOM.append('g');
        yg.attr('transform', "translate(" + (quandlism_yaxis_width - 1) + ", 0)");
        yg.call(yAxis);
        xAxisDOM.selectAll('*').remove();
        xg = xAxisDOM.append('g');
        xg.call(xAxis);
      };
      drawGridLines = function() {
        var x, y, _i, _j, _len, _len1, _ref, _ref1, _results;
        _ref = yScale.ticks(Math.floor(context.h() * quandlism_stage.h / 30));
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          y = _ref[_i];
          ctx.beginPath();
          ctx.strokeStyle = '#EDEDED';
          ctx.lineWidth = 1;
          ctx.moveTo(0, Math.floor(yScale(y)));
          ctx.lineTo(width, Math.floor(yScale(y)));
          ctx.stroke();
          ctx.closePath();
        }
        _ref1 = xScale.ticks(Math.floor((context.w() - quandlism_yaxis_width) / 100));
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          x = _ref1[_j];
          ctx.beginPath();
          ctx.strokeStyle = '#EDEDED';
          ctx.lineWith = 1;
          ctx.moveTo(xScale(x), height);
          ctx.lineTo(xScale(x), 0);
          ctx.stroke();
          _results.push(ctx.closePath());
        }
        return _results;
      };
      draw = function(lineId) {
        var j, lineWidth, _i, _len;
        drawAxis();
        ctx.clearRect(0, 0, width, height);
        drawGridLines();
        lineId = lineId != null ? lineId : -1;
        for (j = _i = 0, _len = lines.length; _i < _len; j = ++_i) {
          line = lines[j];
          lineWidth = j === lineId ? 3 : 1.5;
          line.drawPath(ctx, xScale, yScale, dateStart, dateEnd, lineWidth, false, 3);
        }
      };
      lineHit = function(m) {
        var hex, hitMatrix, i, j, k, n, _i, _j, _k, _ref, _ref1, _ref2, _ref3, _ref4;
        hex = context.utility().getPixelRGB(m, ctx);
        i = _.indexOf(context.colorList(), hex);
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
          i = _.indexOf(context.colorList(), hex);
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
      drawTooltip = function(loc, x, line, hex) {
        var inTooltip, pointSize, tooltipText, w;
        draw(line.id());
        pointSize = 3;
        line.drawPoint(ctx, xScale, yScale, x, pointSize);
        return;
        inTooltip = loc[1] <= 20 && loc[0] >= (width - 250);
        w = inTooltip ? width - 400 : width;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(237, 237, 237, 0.80)';
        ctx.fillRect(w - 240, 0, 240, 15);
        ctx.closePath();
        ctx.fillStyle = '#000';
        ctx.textAlign = 'start';
        tooltipText = "" + (context.utility().getMonthName(date.getUTCMonth())) + "  " + (date.getUTCDate()) + ", " + (date.getFullYear()) + ": ";
        tooltipText += "" + (context.utility().formatNumberAsString(value.toFixed(2)));
        ctx.fillText(tooltipText, w - 110, 10, 100);
        ctx.fillStyle = line.color();
        ctx.textAlign = 'end';
        ctx.fillText("" + (context.utility().truncate(line.name(), 20)), w - 120, 10, 200);
      };
      clearTooltip = function() {
        draw();
      };
      if (context.dombrush() == null) {
        dateStart = _.first(lines[0].dates());
        dateEnd = _.last(lines[0].dates());
        setScales();
        draw();
      }
      context.on('respond.stage', function() {
        ctx.clearRect(0, 0, width, height);
        width = Math.floor(context.w() - quandlism_yaxis_width - 1);
        height = Math.floor(context.h() * quandlism_stage.h);
        canvas.attr('width', width);
        canvas.attr('height', height);
        yAxisDOM.attr('width', quandlism_yaxis_width);
        xAxisDOM.attr('width', Math.floor(context.w() - quandlism_yaxis_width));
        setScales();
        draw();
      });
      context.on('adjust.stage', function(_dateStart, _dateEnd) {
        dateStart = _dateStart;
        dateEnd = _dateEnd;
        setScales();
        draw();
      });
      context.on('toggle.stage', function() {
        setScales();
        draw();
      });
      context.on('refresh.stage', function() {
        lines = selection.datum();
        line = _.first(lines);
        if (!context.dombrush()) {
          draw();
        }
      });
      d3.select("#" + canvasId).on('mousemove', function(e) {
        var hit, loc;
        loc = d3.mouse(this);
        hit = lineHit(loc);
        if (!!hit) {
          console.log(xScale.invert(hit.x));
        }
        if (hit !== false) {
          drawTooltip(loc, Math.round(xScale.invert(hit.x)), hit.line, hit.color);
        } else {
          clearTooltip();
        }
      });
    };
    stage.canvasId = function(_) {
      if (!(_ != null)) {
        return canvasId;
      }
      canvasId = _;
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
    var activeHandle, brush, brushId, buffer, canvas, canvasId, context, ctx, dateEnd, dateStart, dragEnabled, dragging, drawEnd, drawStart, extent, handleWidth, height, line, lines, pristine, stertchhMin, stretchLimit, stretching, threshold, touchPoint, useCache, width, xAxis, xScale, yScale,
      _this = this;
    context = this;
    height = Math.floor(context.h() * quandlism_brush.h);
    width = Math.floor(context.w() - quandlism_yaxis_width);
    dateStart = dateEnd = drawStart = drawEnd = line = null;
    dragging = dragEnabled = stretching = touchPoint = null;
    canvas = ctx = canvasId = brushId = null;
    extent = lines = [];
    xScale = d3.time.scale();
    yScale = d3.scale.linear();
    xAxis = d3.svg.axis().orient('bottom').scale(xScale);
    threshold = 10;
    handleWidth = 10;
    stretchLimit = 6;
    stertchhMin = 100;
    activeHandle = 0;
    buffer = document.createElement('canvas');
    useCache = false;
    pristine = {};
    brush = function(selection) {
      var checkDragState, clearCanvas, dispatchAdjust, draw, drawAxis, drawBrush, drawFromCache, getPristine, isDraggingLocation, isLeftHandle, isRightHandle, removeCache, saveCanvasData, saveState, setBrushClass, setBrushValues, setPristine, setScales, update, xAxisDOM;
      if (!(canvasId != null)) {
        canvasId = "canvas-brush-" + (++quandlism_id_ref);
      }
      lines = selection.datum();
      line = _.first(lines);
      dateStart = _.first(line.dates());
      dateEnd = _.last(line.dates());
      selection.attr("style", "position: absolute; top: " + (context.h() * (quandlism_stage.h + quandlism_xaxis.h)) + "px; left: " + quandlism_yaxis_width + "px");
      canvas = selection.append('canvas');
      canvas.attr('id', canvasId);
      canvas.attr("style", "position: absolute; left: 0px; top: 0px");
      ctx = canvas.node().getContext('2d');
      xAxisDOM = selection.append('svg');
      xAxisDOM.attr('class', 'x axis');
      xAxisDOM.attr('id', "x-axis-" + canvasId);
      xAxisDOM.attr('height', Math.floor(context.h() * quandlism_xaxis.h));
      xAxisDOM.attr('width', Math.floor(context.w() - quandlism_yaxis_width));
      xAxisDOM.attr("style", "position: absolute; top: " + (context.h() * quandlism_brush.h) + "px; left: 0px");
      checkDragState = function() {
        if ((line.length()) <= stretchLimit) {
          dateStart = _.first(line.dates());
          dateEnd = _.last(line.dates());
          drawStart = xScale(dateStart);
          drawEnd = xScale(dateEnd);
          return dragEnabled = false;
        } else {
          return dragEnabled = true;
        }
      };
      setScales = function() {
        yScale.domain(context.utility().getExtent(lines, null, null));
        yScale.range([height - context.padding(), context.padding()]);
        xScale.range([context.padding(), width - context.padding()]);
        xScale.domain([_.first(line.dates()), _.last(line.dates())]);
      };
      setBrushValues = function() {
        dateStart = line.dateAt(Math.floor(context.startPoint() * line.length()));
        dateEnd = _.last(line.dates());
        drawStart = xScale(dateStart);
        drawEnd = xScale(dateEnd);
        setPristine('dateStart', dateStart);
        setPristine('dateEnd', dateEnd);
        setPristine('drawStart', drawStart);
        setPristine('drawEnd', drawEnd);
      };
      update = function() {
        clearCanvas();
        if (useCache) {
          drawFromCache();
        } else {
          draw();
        }
        drawBrush();
      };
      clearCanvas = function() {
        ctx.clearRect(0, 0, getPristine('width'), getPristine('height'));
        canvas.attr('width', width).attr('height', height);
      };
      drawAxis = function() {
        var xg;
        xAxisDOM.selectAll('*').remove();
        xg = xAxisDOM.append('g');
        xg.call(xAxis);
      };
      draw = function() {
        var j, _i, _len;
        for (j = _i = 0, _len = lines.length; _i < _len; j = ++_i) {
          line = lines[j];
          line.drawPath(ctx, xScale, yScale, _.first(line.dates()), _.last(line.dates()), 1, line.length() <= threshold, false);
        }
        saveCanvasData();
      };
      drawFromCache = function() {
        ctx.drawImage(buffer.canvas, 0, 0);
      };
      saveCanvasData = function() {
        useCache = true;
        buffer.setAttribute('width', width);
        buffer.setAttribute('height', height);
        buffer = buffer.getContext('2d');
        buffer.drawImage(document.getElementById(canvasId), 0, 0);
      };
      drawBrush = function() {
        ctx.strokeStyle = 'rgba(237, 237, 237, 0.80)';
        ctx.beginPath();
        ctx.fillStyle = 'rgba(237, 237, 237, 0.80)';
        ctx.fillRect(drawStart, 0, drawEnd - drawStart, height);
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#D9D9D9';
        ctx.fillRect(drawStart - handleWidth, 0, handleWidth, height);
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#D9D9D9';
        ctx.fillRect(drawEnd, 0, handleWidth, height);
        ctx.closePath();
      };
      removeCache = function() {
        buffer = document.createElement('canvas');
        useCache = false;
      };
      dispatchAdjust = function(calculateDates) {
        calculateDates = calculateDates != null ? calculateDates : false;
        if (calculateDates) {
          dateStart = xScale.invert(drawStart);
          dateEnd = xScale.invert(drawEnd);
        }
        context.adjust(dateStart, dateEnd);
      };
      saveState = function() {
        dragging = false;
        stretching = false;
        activeHandle = 0;
        dateStart = xScale.invert(drawStart);
        dateEnd = xScale.invert(drawEnd);
        setPristine('drawStart', drawStart);
        setPristine('dateStart', dateStart);
        setPristine('drawEnd', drawEnd);
        setPristine('dateEnd', dateEnd);
      };
      isDraggingLocation = function(x) {
        return x <= drawEnd && x >= drawStart;
      };
      isLeftHandle = function(x) {
        return x >= (drawStart - handleWidth) && x < drawStart;
      };
      isRightHandle = function(x) {
        return x > drawEnd && x <= (drawEnd + handleWidth);
      };
      setBrushClass = function(className) {
        document.getElementById("" + (context.dombrush().substring(1))).className = className;
      };
      setPristine = function(key, value) {
        pristine[key] = value;
      };
      getPristine = function(key) {
        var _ref;
        return (_ref = pristine[key]) != null ? _ref : null;
      };
      setPristine('width', width);
      setPristine('height', height);
      setScales();
      checkDragState();
      if (dragEnabled) {
        setBrushValues();
      }
      drawAxis();
      dispatchAdjust();
      setInterval(update, 70);
      context.on("respond.brush", function() {
        setPristine('height', height);
        setPristine('width', width);
        height = Math.floor(context.h() * quandlism_brush.h);
        width = Math.floor(context.w() - quandlism_yaxis_width);
        removeCache();
        setScales();
        drawStart = xScale(dateStart);
        drawEnd = xScale(dateEnd);
        saveState();
        xAxisDOM.attr('width', width);
        drawAxis();
      });
      context.on('refresh.brush', function() {
        lines = selection.datum();
        line = _.first(lines);
        removeCache();
        setScales();
        checkDragState();
        if (dragEnabled) {
          setBrushValues();
        }
        drawAxis();
        dispatchAdjust();
      });
      context.on("toggle.brush", function() {
        removeCache();
        setScales();
      });
      canvas.on('mousedown', function(e) {
        var m;
        d3.event.preventDefault();
        m = d3.mouse(this);
        touchPoint = m[0];
        if (isLeftHandle(m[0])) {
          stretching = true;
          activeHandle = -1;
        } else if (isRightHandle(m[0])) {
          stretching = true;
          activeHandle = 1;
        } else if (isDraggingLocation(m[0])) {
          dragging = true;
        }
      });
      canvas.on('mouseup', function(e) {
        saveState();
      });
      canvas.on('mouseout', function(e) {
        setBrushClass('');
        saveState();
      });
      return canvas.on('mousemove', function(e) {
        var dragDiff, m;
        m = d3.mouse(this);
        if (dragging || stretching) {
          dragDiff = m[0] - touchPoint;
          if (dragging && dragEnabled) {
            drawStart = getPristine('drawStart') + dragDiff;
            drawEnd = getPristine('drawEnd') + dragDiff;
          } else if (stretching) {
            if (activeHandle !== 0 && activeHandle !== (-1) && activeHandle !== 1) {
              throw "Error: Unknown stretching direction";
            }
            if (activeHandle === -1) {
              drawStart = getPristine('drawStart') + dragDiff;
            }
            if (activeHandle === 1) {
              drawEnd = getPristine('drawEnd') + dragDiff;
            }
          }
          dispatchAdjust(true);
        } else if (dragEnabled) {
          if (isDraggingLocation(m[0])) {
            setBrushClass('move');
          } else if (isLeftHandle(m[0]) || isRightHandle(m[0])) {
            setBrushClass('resize');
          } else {
            setBrushClass('');
          }
        }
      });
    };
    brush.canvasId = function(_) {
      if (!(_ != null)) {
        return canvasId;
      }
      canvasId = _;
      return brush;
    };
    brush.xScale = function(_) {
      if (!(_ != null)) {
        return xScale;
      }
      xScale = _;
      return brush;
    };
    brush.yScale = function(_) {
      if (!(_ != null)) {
        return yScale;
      }
      yScale = _;
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
      axis_.ticks(Math.floor(height / 25, 0, 0));
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
        axis_.ticks(Math.floor(height / 25, 0, 0));
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
    var context, legend, lines;
    context = this;
    lines = [];
    legend = function(selection) {
      var buildLegend;
      buildLegend = function() {
        var _this = this;
        lines = selection.datum();
        selection.selectAll('li').remove();
        selection.selectAll('li').data(lines).enter().append('li').attr('style', function(line) {
          return "color: " + (line.color());
        }).attr('class', function(line) {
          if (!line.visible()) {
            return "off";
          }
        }).append('a', ':first-child').attr('href', 'javascript:;').attr('data-line-id', function(line) {
          return line.id();
        }).text(function(line) {
          return line.name();
        });
        selection.selectAll('a').on("click", function(d, i) {
          var e, el, id, line;
          e = d3.event;
          el = e.target;
          id = parseInt(el.getAttribute('data-line-id'));
          e.preventDefault();
          line = _.find(lines, function(l) {
            return l.id() === id;
          });
          if (line != null) {
            if (line.toggle() === false) {
              $(el).parent().addClass('off');
            } else {
              $(el).parent().removeClass('off');
            }
            context.toggle();
          }
        });
      };
      buildLegend();
      context.on('refresh.legend', function() {
        buildLegend();
      });
    };
    return legend;
  };

  QuandlismContext_.utility = function() {
    var context, utility,
      _this = this;
    context = this;
    utility = function() {};
    utility.truncate = function(word, chars) {
      if (word.length > chars) {
        return "" + (word.substring(0, chars)) + "...";
      } else {
        return word;
      }
    };
    utility.createLines = function(data) {
      var defaultColumn, i, keys, line, lineData, lines, _i, _len;
      if (!context.lines().length) {
        keys = data.columns.slice(1);
        lineData = _.map(keys, function(key, i) {
          return utility.getLineData(data.data, i);
        });
        defaultColumn = utility.defaultColumn(data.code);
        lines = _.map(keys, function(key, i) {
          return context.line({
            name: key,
            values: lineData[i]
          });
        });
        for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
          line = lines[i];
          if (i !== defaultColumn) {
            line.visible(false);
          }
        }
      } else {
        lines = utility.mergeLines(context.lines(), data);
      }
      return lines;
    };
    utility.getLineData = function(data, index) {
      var formatter;
      formatter = d3.time.format("%Y-%m-%d");
      return _.map(data, function(d) {
        return {
          date: formatter.parse(d[0]),
          num: d[index + 1]
        };
      });
    };
    utility.mergeLines = function(lines, data) {
      lines = utility.addNewLinesAndRefresh(lines, data);
      lines = utility.removeStaleLines(lines, data.columns);
      if (!(!(lines[0] != null) || _.find(lines, function(line) {
        return line.visible() === true;
      }))) {
        lines[0].visible(true);
      }
      return lines;
    };
    utility.addNewLinesAndRefresh = function(lines, data) {
      var column, columnIndex, found, i, line, lineData, _i, _j, _len, _len1, _ref;
      _ref = data.columns.slice(1);
      for (columnIndex = _i = 0, _len = _ref.length; _i < _len; columnIndex = ++_i) {
        column = _ref[columnIndex];
        found = false;
        lineData = utility.getLineData(data.data, columnIndex);
        for (i = _j = 0, _len1 = lines.length; _j < _len1; i = ++_j) {
          line = lines[i];
          if (line.name() === column) {
            found = true;
            lines[i].values(lineData.reverse());
            break;
          }
        }
        if (!found) {
          line = context.line({
            name: column,
            values: lineData
          });
          line.visible(false);
          lines.push(line);
        }
      }
      return lines;
    };
    utility.removeStaleLines = function(lines, columns) {
      return _.reject(lines, function(line) {
        var _ref;
        return _ref = line.name(), __indexOf.call(columns, _ref) < 0;
      });
    };
    utility.defaultColumn = function(code) {
      if (code == null) {
        return 0;
      }
      if (code.match(/^FUTURE_/)) {
        return 3;
      } else {
        return 0;
      }
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
    utility.getExtentFromDates = function(lines, startDate, endDate) {
      var exes, line;
      exes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          _results.push(line.extentByDate(startDate, endDate));
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
    utility.getMonthName = function(monthDigit) {
      var months;
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[monthDigit];
    };
    utility.getColor = function(i) {
      return context.colorList()[i];
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
    utility.getUnitAndDivisor = function(extent) {
      var len;
      len = extent.toString().length;
      if (len <= 3) {
        return {
          label: '',
          divisor: 1
        };
      } else if (len <= 6) {
        return {
          label: 'K',
          divisor: 1000
        };
      } else if (len <= 9) {
        return {
          label: 'M',
          divisor: 1000000
        };
      } else {
        return {
          label: 'B',
          divisor: 1000000000
        };
      }
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