QuandlismContext_.stage = function() {
  var context = this,
  lines = [],
  canvasId = 'canvas-stage',
  width = Math.floor(context.w()*quandlism_stage.w), 
  height = Math.floor(context.h()*quandlism_stage.h)
  xScale = d3.scale.linear(),
  yScale = d3.scale.linear(),
  threshold = 10,
  extent = null,
  canvas = null,
  ctx = null,
  colorRange = [],
  start = 0, 
  end = 0;  
  
  function stage(selection) {
    
    // Extract line data    
    lines = selection.datum();
        
    // Append div for y-axis and call yaxis from context
    selection.append('div').datum(lines).attr('class', 'y axis').attr('id', 'y-axis-stage').call(context.yaxis().active(true).orient('left'));
    
    // Append div for stage-holder (to hold x-axis, stage data and brush)
    stageHolder = selection.append('div').attr('class', 'stage-holder');
  
    // Append x-axis and stage
    stageHolder.append('canvas').attr('width', width).attr('height', height).attr('class', 'stage').attr('id', canvasId);
    stageHolder.append('div').datum(lines).attr('class', 'x axis').attr('id', 'x-axis-stage').call(context.axis().active(true));    
    
    // If Legend DOM is defined, create the legend. Style w/ CSS
    if (!_.isUndefined(context.domlegend())) {
      d3.select(context.domlegend()).datum(lines).call(context.legend());
    }
  
    
    // Get references to canvas and canvas context for drawing
    canvas = selection.select('.stage');
    ctx = canvas.node().getContext('2d');
    
    // Calculate initial start / end points
    end = lines[0].length();
    start = Math.floor(lines[0].length()*.80);

    // Draw the stage
    draw();
     
    // After drawing the first time, save the computed color range for easy look up later!
    colorRange = context.colorScale().range();

    /**
     * Draws the stage
     * Calculates extents, given the start and end, adjusts the axis domain/ranges and draws the path
     *
     * lineId - The id of the line that should be highlighted when the stage is drawn
     */
    function draw(lineId) {

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
      
      // If lineId is not specified, set it as an invalid index
      lineId = (_.isUndefined(lineId)) ? -1 : lineId;
      
      _.each(lines, function(line, j) {   
        // If we are drawing the line corresponding to a line that should be highlighted, increase the width
        lineWidth = (j == lineId) ? 3 : 1.5
        if ((end - start) <= threshold) {
          // If number of points under the threshold are being drawn, render the invidual points
          line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, start, end, lineWidth);
          _.each(_.range(start, end + 1), function(p) {
            line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, p, 3);
          });
        }     
        else if (start == end) {
          // If drawing a single point, just render the point
          line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, start, 3);
        } else {
          // Otherwise, draw the path
          line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, start, end, lineWidth);
        }
      });
      
    }
    
    /**
     * Shows tooltip data for the mouseover event.
     *
     * line - The active line object that was moused over.
     * x - The data index that will be highlighted
     * hex - The color of the line
     */
    function showTooltip(line, x, hex) {
      $(context.domtooltip()).html('<span style="color: ' + hex + ';">' + line.name() + '</span> : ' + line.valueAt(x) + '');    
      draw(line.id());
      line.drawPoint(hex, ctx, xScale, yScale, x, ((end - start) <= threshold) ? 5: 3);
    }
    
    /**
     * Removes content from the tooltip element
     */
    function clearTooltip() {
      $(context.domtooltip()).text('');
    }
    
    /**
     * Given the mouse location, check the coordinates, and the immediate area around the coordinates
     * for a line
     *
     * m - An array with 2 elements, representing the x and y coordinates (in canvas space), of the mouse location
     *
     * Returns false if there was no line hit, or the index of the line
     */
    function lineHit(m) {

        
      hex = context.utility().getPixelRGB(m);
      
      i = _.indexOf(colorRange, hex);
      if (i !== -1) {
        return {x: m[0], color: hex, line: lines[i]};
      }
      
      // Genreate matrix of points to analyze      
      hitMatrix = [];
      for (j = (m[0]-3); j <= (m[0]+3); j++) {
        for (k = (m[1]-3); k <= (m[1]+3); k++) {
          if (j != m[0] || k != m[1]) {
            hitMatrix.push([j, k]);
          }
        }
      }
      
      for (n = 0; n < hitMatrix.length; n++) {
        hex = context.utility().getPixelRGB(hitMatrix[n]);
        i = _.indexOf(colorRange, hex);
        if (i !== -1) {
          return {x: hitMatrix[n][0], color: hex, line: lines[i]};
        }
      }
      
      return false;
    }
    
    
  
    
    /**
     * Callbacks
     */
    
    /**
     * Callback for context.respond event
     *
     * Clears the drawing context, recalculates width / height and re-draws
     */
    context.on('respond.stage', function() {
      ctx.clearRect(0, 0, width, height);
      width = Math.floor(context.w()*quandlism_stage.w), height = Math.floor(context.h()*quandlism_stage.h);
      canvas.attr('width', width).attr('height', height);
      draw();
    });
    
    /**
     * Callback for context.adjust event
     *
     * Recalculates start and end points and re-draws the stage
     */
    context.on('adjust.stage', function(x1, x2) {
      start = (x1 > 0) ? x1 : 0;
      end = (x2 < lines[0].length()) ? x2 : lines[0].length() -1;
      draw();
    });
    
    
    /**
     * Callback for context.toggle event
     *
     * Only redraw. Visiblity handled by line object
     */
    context.on('toggle.stage', function() {
      draw();
    });
        
  
    /**
     * If tooltip dom is defined, track mousemovement on stage to render tooltip 
     */
    if (!_.isUndefined(context.domtooltip())) {
      d3.select('#' + canvasId).on('mousemove', function(e) {
        
        hit = lineHit(d3.mouse(this));

        if (hit !== false) {
          showTooltip(hit.line, Math.round(xScale.invert(hit.x)), hit.color);
        } else {
          clearTooltip();
          draw();
        }

      });
    }

      
    // Draw the brush inside the stage-holder
    stageHolder.call(context.brush());
    
      
    /**
     * Getter/setters
     */
    stage.threshold = function(_) {
      if (!arguments.length) {
        return threshold;
      }
      threshold = _;
      return stage;
    }
      
  }

  
  return stage;
}