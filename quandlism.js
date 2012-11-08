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
    this.event = d3.dispatch('respond', 'adjust', 'toggle', 'refresh');
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
    this.context.w = function(_) {
      if (!_) {
        return _this.w;
      }
      _this.w = _;
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
    return line;
  };

  QuandlismContext_.stage = function() {
    var _this = this;
    this.context = this;
    this.id = null;
    this.lines = [];
    this.width = null;
    this.height = null;
    this.padding = 10;
    this.stage = function(selection) {
      console.log(selection);
    };
    this.context.on('respond', function() {
      return console.log(_this.context.w());
    });
    this.stage.padding = function(_) {
      if (!_) {
        return _this.padding;
      }
      _this.padding = _;
      return _this.stage;
    };
    this.stage.id = function(_) {
      if (!_) {
        return _this.id;
      }
      _this.id = _;
      return _this.stage;
    };
    this.stage.width = function(_) {
      if (!_) {
        return _this.width;
      }
      _this.width = _;
      return _this.stage;
    };
    this.stage.height = function(_) {
      if (!_) {
        return _this.height;
      }
      _this.height = _;
      return _this.stage;
    };
    return this.stage;
  };

  QuandlismContext_.utility = function() {
    var _this = this;
    this.context = this;
    this.utility = function() {};
    this.utility.createLines = function(data) {
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
    return this.utility;
  };

}).call(this);

 })(this);