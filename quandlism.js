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
    this.id = null;
    this.lines = [];
    this.width = Math.floor(this.context.w() * quandlism_stage.w);
    this.height = Math.floor(this.context.h() * quandlism_stage.h);
    this.xScale = d3.scale.linear();
    this.yScale = d3.scale.linear();
    this.padding = 10;
    this.extent = [];
    this.xStart = null;
    this.xEnd = null;
    this.threshold = 10;
    this.canvas = null;
    this.ctx = null;
    stage = function(selection) {
      _this.lines = selection.datum();
      _this.id = "canvas-stage-" + (++quandlism_id_ref);
      selection.append('canvas').attr('width', _this.width).attr('height', _this.height).attr('class', 'stage').attr('id', _this.id);
      _this.canvas = selection.select("#" + _this.id);
      _this.ctx = _this.canvas.node().getContext('2d');
      _this.xStart = !_this.xStart ? Math.floor(_this.lines[0].length() * _this.context.endPercent()) : _this.xStart;
      _this.xEnd = !_this.xEnd ? lines[0].length() : _this.xEnd;
      _this.draw = function(lineId) {
        var j, line, lineWidth, _i, _len, _ref, _results;
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
          _results.push(line.drawPath(_this.context.utility().getColor(j), _this.ctx, _this.xScale, _this.yScale, _this.xStart, _this.xEnd, lineWidth));
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
    stage.id = function(_) {
      if (!_) {
        return _this.id;
      }
      _this.id = _;
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
    return utility;
  };

}).call(this);

 })(this);