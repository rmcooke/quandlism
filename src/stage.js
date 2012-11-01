QuandlismContext_.stage = function() {
  var context = this,
  lines = [],
  width = Math.floor(context.w()*quandlism_stage.w), height = Math.floor(context.h()*quandlism_stage.h)
  xScale = d3.scale.linear(),
  yScale = d3.scale.linear(),
  extent = null,
  canvas = null,
  axis = null,
  ctx = null,
  colorRange = [],
  start = 0, end = 0;
  
  
  function stage(selection) {
    
    // Setup
    var self = this;
    lines = selection.datum();
        
    // Append div to hold y-axis
    selection.append('div').datum(lines).attr('class', 'y axis').attr('id', 'y-axis-stage').call(context.yaxis().active(true).orient('left'));
    
    // Append div to hold stage canvas and x-axis
    div = selection.append('div').attr('class', 'stage-holder');
  
    // x-axis and canvas
    div.append('canvas').attr('width', width).attr('height', height).attr('class', 'stage');
    div.append('div').datum(lines).attr('class', 'x axis').attr('id', 'x-axis-stage').call(context.axis().active(true));    
    
    // If Legend DOM is defined, create the legend. Style w/ CSS
    if (context.domlegend() != null) {
      d3.select(context.domlegend()).datum(lines).call(context.legend());
    }
    
    canvas = selection.select('.stage');
    ctx = canvas.node().getContext('2d');
    
    // Determine start and end poitns
    end = lines[0].length();
    start = Math.floor(lines[0].length()*.80);

    draw();
    
    // After drawing the first time, save the computed color range for easy look up later!
    colorRange = context.colorScale().range();
    
    
    
    function draw() {
      exes = _.map(lines, function(line, j) {
        return line.extent(start, end);
      });  
      extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })]
    
      // For single points, edit extent so circle is not drawn at the corner
      xStart = 0;
      if (start == end) {
        extent = [0, extent[0]*1.25];
        xStart = Math.floor(width/2);
      }
      yScale.domain([extent[0], extent[1]]); 
      yScale.range([height, 0 ]);
    
      xScale.domain([start, end]);
      xScale.range([xStart, width]);
      
      ctx.clearRect(0, 0, width, height);
      
      _.each(lines, function(line, j) {        
        if (start == end) {
          line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, start);
        } else {
          line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, start, end, 3);
        }
      });
      
    }
    
    // Respond to changes in the containing element width/height
    context.on('respond.stage', function() {
      ctx.clearRect(0, 0, width, height);
      width = Math.floor(context.w()*quandlism_stage.w), height = Math.floor(context.h()*quandlism_stage.h);
      canvas.attr('width', width).attr('height', height);
      draw();
    });
    
    // Respond to brush resize and movement
    context.on('adjust.stage', function(x1, x2) {
      start = (x1 > 0) ? x1 : 0;
      end = (x2 < lines[0].length()) ? x2 : lines[0].length() -1;
      draw();
    });
    
    // Respond to toggling of line visibility
    context.on('toggle.stage', function() {
      draw();
    });
  
  
    // Detect mouse move for tooltip
    canvas.node().addEventListener('mousemove', function(e) {
      click = context.utility().getClickLocation(e, canvas.node());
      px = ctx.getImageData(click.x, click.y, 1, 1).data;
      if (!(px[0] == 0 && px[1] == 0 && px[2] == 0)) {
        rgb = d3.rgb(px[0], px[1], px[2]);
        hex = rgb.toString();

        index = _.indexOf(colorRange, hex);
        if (index !== -1) {
          line = lines[index];
          lineIndex = Math.ceil(xScale.invert(click.x));
          console.log(line.name() + '-' + line.valueAt(lineIndex));
        }
        
      }

      
    
    });
    
    canvas.node().addEventListener('mousedown', function() {
      
    });

    // Draw the brush
    div.call(context.brush());
    
    
    

      
  }

  
  stage.lines = function(_) {
    if (!arguments.length) {
      return lines;
    }
    lines = _;
    return stage;
  }
  
  return stage;
}