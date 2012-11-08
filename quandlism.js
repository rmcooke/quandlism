(function(exports) { 
(function() {
  var QuandlismContext, QuandlismContext_, QuandlismLine, quandlism, quandlism_axis, quandlism_brush, quandlism_id_ref, quandlism_line_id, quandlism_stage, quandlism_xaxis, quandlism_yaxis;

  quandlism = exports.quandlism = {
    version: '0.2.0'
  };

  quandlism.context = function() {
    var _this = this;
    this.context = new QuandlismContext();
    this.w = null;
    this.h = null;
    this.dom = null;
    this.domstage = null;
    this.dombrush = null;
    this.domlegend = null;
    this.domtooltip = null;
    this.endPercent = 0.8;
    this.event = d3.dispatch('respond', 'adjust', 'toggle', 'refresh');
    this.colorScale = d3.scale.category20();
    this.context.attachData = function(lines) {
      var stage;
      if (_this.domstage) {
        stage = d3.select(_this.domstage).datum(lines);
      }
      return _this.context;
    };
    this.context.render = function() {
      if (_this.domstage) {
        d3.select(_this.domstage).call(_this.context.stage());
      }
      return _this.context;
    };
    this.context.colorScale = function(_) {
      if (!_) {
        return _this.colorScale;
      }
      _this.colorScale = _;
      return _this.context;
    };
    this.context.endPercent = function(_) {
      if (!_) {
        return _this.endPercent;
      }
      _this.endPercent = _;
      return _this.context;
    };
    this.context.w = function(_) {
      if (!_) {
        return _this.w;
      }
      _this.w = _;
      return _this.context;
    };
    this.context.h = function(_) {
      if (!_) {
        return _this.h;
      }
      _this.h = _;
      return _this.context;
    };
    this.context.dom = function(_) {
      if (!_) {
        return _this.dom;
      }
      _this.dom = _;
      return _this.context;
    };
    this.context.domstage = function(_) {
      if (!_) {
        return _this.domstage;
      }
      _this.domstage = _;
      return _this.context;
    };
    this.context.dombrush = function(_) {
      if (!_) {
        return _this.dombrush;
      }
      _this.dombrush = _;
      return _this.context;
    };
    this.context.domlegend = function(_) {
      if (!_) {
        return _this.domlegend;
      }
      _this.domlegend = _;
      return _this.context;
    };
    this.context.respond = _.throttle(function() {
      return _this.event.respond.call(_this.context, 500);
    });
    this.context.on = function(type, listener) {
      if (arguments.length < 2) {
        return _this.event.on(type);
      }
      _this.event.on(type, listener);
      return _this.context;
    };
    d3.select(window).on('resize', function() {
      var h0, w0;
      d3.event.preventDefault();
      if (_this.dom) {
        w0 = $(_this.dom).width();
        h0 = $(_this.dom).height();
        if (_this.w !== w0 || _this.h !== h0) {
          _this.w = w0;
          _this.h = h0;
          _this.context.respond();
        }
      }
    });
    return this.context;
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
    w: 0.85,
    h: 0.60
  };

  quandlism_brush = {
    w: 0.85,
    h: 0.10
  };

  quandlism_xaxis = {
    w: 0.85,
    h: 0.15
  };

  quandlism_yaxis = {
    w: 0.10,
    h: 0.60
  };

  QuandlismLine = (function() {

    function QuandlismLine() {}

    return QuandlismLine;

  })();

  QuandlismContext_.line = function(data) {
    var line,
      _this = this;
    line = new QuandlismLine(this.context);
    this.context = this;
    this.name = data.name;
    this.values = data.values.reverse();
    this.id = quandlism_line_id++;
    this.visible = true;
    line.extent = function(start, end) {
      var i, max, min, n, val;
      i = start != null ? start : 0;
      n = end != null ? end : this.length()(-1);
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
      return _this.values.length;
    };
    line.valueAt = function(i) {
      if (_this.values[i] != null) {
        return _this.values[i].num;
      } else {
        return null;
      }
    };
    line.dateAt = function(i) {
      if (_this.values[i] != null) {
        return _this.values[i].date;
      } else {
        return null;
      }
    };
    line.drawPoint = function(color, ctx, xS, yX, index, radius) {
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
    line.id = function(_) {
      if (!_) {
        return _this.id;
      }
      _this.id = _;
      return line;
    };
    line.name = function(_) {
      if (!_) {
        return _this.name;
      }
      _this.name = _;
      return line;
    };
    line.values = function(_) {
      if (!_) {
        return _this.values;
      }
      _this.values = _;
      return line;
    };
    line.visible = function(_) {
      if (!_) {
        return _this.visible;
      }
      _this.visible = _;
      return line;
    };
    return line;
  };

  QuandlismContext_.stage = function() {
    var stage,
      _this = this;
    this.context = this;
    this.canvasId = null;
    this.lines = [];
    this.width = Math.floor(this.context.w() * quandlism_stage.w);
    this.height = Math.floor(this.context.h() * quandlism_stage.h);
    this.xScale = d3.scale.linear();
    this.yScale = d3.scale.linear();
    this.xAxis = null;
    this.yAxis = null;
    this.padding = 10;
    this.extent = [];
    this.xStart = null;
    this.xEnd = null;
    this.threshold = 10;
    this.canvas = null;
    this.ctx = null;
    stage = function(selection) {
      _this.lines = selection.datum();
      _this.canvasId = "canvas-stage-" + (++quandlism_id_ref);
      selection.append('canvas').attr('width', _this.width).attr('height', _this.height).attr('class', 'stage').attr('id', _this.canvasId);
      if (!(_this.xAxis != null)) {
        _this.xAxis = selection.append('div');
        _this.xAxis.datum(_this.lines);
        _this.xAxis.attr('width', _this.context.w() * quandlism_xaxis.w).attr('height', _this.context.h() * quandlism_xaxis.h);
        _this.xAxis.attr('class', 'axis x');
        _this.xAxis.attr('id', "x-axis-" + _this.canvasId);
        _this.xAxis.call(_this.context.xaxis().active(true));
      }
      _this.canvas = selection.select("#" + _this.canvasId);
      _this.ctx = _this.canvas.node().getContext('2d');
      _this.xStart = !_this.xStart ? Math.floor(_this.lines[0].length() * _this.context.endPercent()) : _this.xStart;
      _this.xEnd = !_this.xEnd ? lines[0].length() : _this.xEnd;
      _this.draw = function(lineId) {
        var i, j, line, lineWidth, _i, _len, _ref, _results;
        _this.extent = _this.context.utility().getExtent(_this.lines, _this.xStart, _this.xEnd);
        _this.yScale.domain([_this.extent[0], _this.extent[1]]);
        _this.yScale.range([_this.height - _this.padding, _this.padding]);
        _this.xScale.domain([_this.xStart, _this.xEnd]);
        _this.xScale.range([_this.padding, _this.width - _this.padding]);
        _this.ctx.clearRect(0, 0, _this.width, _this.height);
        lineId = lineId != null ? lineId : -1;
        _ref = _this.lines;
        _results = [];
        for (j = _i = 0, _len = _ref.length; _i < _len; j = ++_i) {
          line = _ref[j];
          lineWidth = j === lineId ? 3 : 1.5;
          if (_this.xEnd - _this.xStart <= _this.threshold) {
            line.drawPath(_this.context.utility().getColor(j), _this.ctx, _this.xScale, _this.yScale, _this.xStart, _this.xEnd, lineWidth);
            _results.push((function() {
              var _j, _ref1, _ref2, _results1;
              _results1 = [];
              for (i = _j = _ref1 = this.xStart, _ref2 = this.xEnd; _ref1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = _ref1 <= _ref2 ? ++_j : --_j) {
                _results1.push(line.drawPoint(this.context.utility().getColor(j), this.ctx, this.xScale, this.yScale, i, 3));
              }
              return _results1;
            }).call(_this));
          } else if (_this.xEnd === _this.xStart) {
            _results.push(line.drawPoint(_this.context.utility().getColor(j), _this.ctx, _this.xScale, _this.yScale, _this.xStart, 3));
          } else {
            _results.push(line.drawPath(_this.context.utility().getColor(j), _this.ctx, _this.xScale, _this.yScale, _this.xStart, _this.xEnd, lineWidth));
          }
        }
        return _results;
      };
      _this.draw();
    };
    this.context.on('respond.stage', function() {
      _this.ctx.clearRect(0, 0, _this.width, _this.height);
      _this.width = Math.floor(_this.context.w() * quandlism_stage.w);
      _this.height = Math.floor(_this.context.h() * quandlism_stage.h);
      _this.canvas.attr('width', _this.width).attr('height', _this.height);
      return _this.draw();
    });
    stage.padding = function(_) {
      if (!_) {
        return _this.padding;
      }
      _this.padding = _;
      return stage;
    };
    stage.canvasId = function(_) {
      if (!_) {
        return _this.canvasId;
      }
      _this.canvasId = _;
      return stage;
    };
    stage.width = function(_) {
      if (!_) {
        return _this.width;
      }
      _this.width = _;
      return stage;
    };
    stage.height = function(_) {
      if (!_) {
        return _this.height;
      }
      _this.height = _;
      return stage;
    };
    stage.xScale = function(_) {
      if (!_) {
        return _this.xScale;
      }
      _this.xScale = _;
      return stage;
    };
    stage.yScale = function(_) {
      if (!_) {
        return _this.yScale;
      }
      _this.yScale = _;
      return stage;
    };
    stage.xEnd = function(_) {
      if (!_) {
        return _this.xEnd;
      }
      _this.xEnd = _;
      return stage;
    };
    stage.xStart = function(_) {
      if (!_) {
        return _this.xStart;
      }
      _this.xStart = _;
      return stage;
    };
    stage.threshold = function(_) {
      if (!_) {
        return _this.threshold;
      }
      _this.threshold = _;
      return stage;
    };
    return stage;
  };

  QuandlismContext_.xaxis = function() {
    var xaxis,
      _this = this;
    this.context = this;
    this.width = this.context.w() * quandlism_xaxis.w;
    this.height = this.context.h() * quandlism_xaxis.h;
    this.scale = d3.time.scale().range([0, this.width]);
    this.axis_ = d3.svg.axis().scale(this.scale);
    this.extent = [];
    this.active = false;
    this.lines = [];
    this.id = null;
    xaxis = function(selection) {
      _this.id = selection.attr('id');
      _this.lines = selection.datum();
      _this.update = function() {
        var g;
        xaxis.remove();
        g = selection.append('svg');
        g.attr('width', this.width);
        g.attr('height', this.height);
        g.append('g');
        g.attr('transform', 'translate(0, 27)');
        return g.call(this.axis_);
      };
      _this.changeScale = function() {
        var parseDate;
        _this.extent = [_this.lines[0].dateAt(0), _this.lines[0].dateAt(_this.lines[0].length() - 1)];
        parseDate = _this.context.utility().parseDate(_this.lines[0].dateAt(0));
        _this.scale.domain([parseDate(_this.extent[0]), parseDate(_this.extent[1])]);
        _this.axis_.tickFormat(d3.time.format('%b %d, %Y'));
        _this.axis_.ticks(Math.floor(_this.width / 150, 0, 0));
        return _this.scale.range([0, _this.width]);
      };
      _this.changeScale();
      return _this.update();
    };
    this.context.on("respond.xaxis-" + this.id, function() {
      _this.width = _this.context.w() * quandlism_xaxis.w;
      _this.axis_.ticks(Math.floor(_this.width / 150, 0, 0));
      _this.scale.range([0, _this.width]);
      return _this.update();
    });
    xaxis.remove = function() {
      return d3.select("#" + _this.id).selectAll("svg").remove();
    };
    xaxis.active = function(_) {
      if (!_) {
        return _this.active;
      }
      _this.active = _;
      return xaxis;
    };
    return d3.rebind(xaxis, this.axis_, 'orient', 'ticks', 'ticksSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
  };

  QuandlismContext_.utility = function() {
    var utility,
      _this = this;
    this.context = this;
    utility = function() {};
    utility.createLines = function(data) {
      var keys;
      keys = data.columns.slice(1);
      return _.map(keys, function(key, i) {
        return _this.context.line({
          name: key,
          values: _.map(data.data, function(d) {
            return {
              date: d[0],
              num: +d[i + 1]
            };
          })
        });
      });
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
      s = _this.context.colorScale();
      return s(i);
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