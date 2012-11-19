quandlism = require '../index'
should    = require('chai').should()

describe 'Create context', () ->
  
  beforeEach () ->
    @domName        = 'quandlism-dom-name'
    @domStageName   = 'quandlism-dom-stage-name'
    @domBrushName   = 'quandlism-dom-brush-name'
    @domLegendName  = 'quandlism-dom-legend-name'
    @c = quandlism.context()
      .dom(@domName)
      .domstage(@domStageName)
      .dombrush(@domBrushName)
      .domlegend(@domLegendName)

    
  it 'should exhibit the dom attribute', () ->
    @c.dom().should.equal @domName
    
  it 'should exhibit the domstage attribute', () ->
    @c.domstage().should.equal @domStageName
    
  it 'should exhibit the dombrush attribute', () ->
    @c.dombrush().should.equal @domBrushName
    
  it 'should exhibit the domlegend attribute', () ->
    @c.domlegend().should.equal @domLegendName
    
