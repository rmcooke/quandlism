quandlism = require '../index'
should    = require('chai').should()
sinon     = require 'sinon'

describe 'quandlism context', () ->
  
  describe 'configure', () ->
      
    beforeEach () ->
      @name         = 'quandlism-dom-name'
      @stageName    = 'quandlism-dom-stage-name'
      @brushName    = 'quandlism-dom-brush-name'
      @legendName   = 'quandlism-dom-legend-name'
      @width        = 100
      @height       = 200
      @padding      = 10
      @lines        = ['line']
      @startPoint   = 10
      @colorList    = ['#EDEDED', '#CFCFCF']
      
      @c = quandlism.context()
        .dom(@name)
        .domstage(@stageName)
        .dombrush(@brushName)
        .domlegend(@legendName)
        .w(@width)
        .h(@height)
        .padding(@padding)
        .lines(@lines)
        .startPoint(@startPoint)
        .colorList(@colorList)

    
    it 'should exhibit the dom attribute', () ->
      @c.dom().should.equal @name
    
    it 'should exhibit the domstage attribute', () ->
      @c.domstage().should.equal @stageName
    
    it 'should exhibit the dombrush attribute', () ->
      @c.dombrush().should.equal @brushName
    
    it 'should exhibit the domlegend attribute', () ->
      @c.domlegend().should.equal @legendName
      
    it 'should exhibit the width attribute', () ->
      @c.w().should.equal @width
      
    it 'should exhibit the height attribute', () ->
      @c.h().should.equal @height
      
    it 'should exhibit the padding attribute', () ->
      @c.padding().should.equal @padding
      
    it 'should exhibit the lines attribute', () ->
      @c.lines().should.equal @lines
      
    it 'should exhibit the startPoint attribute', () ->
      @c.startPoint().should.equal @startPoint
      
    it 'should exhibit the colorList attribute', () ->
      @c.colorList().should.equal @colorList
    
    
  describe 'attach data', () ->
    
    beforeEach () ->
      @c = quandlism.context().dom('#dom').domstage('#domstage')
      @colorCount = @c.colorList().length
      @lines = []
      for i in [1..(@colorCount+10)]
        @lines.push @c.line { name: "line-#{i}", values: [] }
      @c.attachData @lines
      
    it 'should create more color values as needed', () ->
      @c.colorList().length.should.equal @colorCount+10 
      
    it 'should attach data to defined dom elements', () ->
      false.should.equal true
      
    it 'should only attach data to legend if more than one line is present', () ->
      false.should.equal true
      
    
  describe 'build', () ->
    
    
  describe 'render', () ->
    
    
  describe 'refresh', () ->
    
    
