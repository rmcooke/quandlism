# Quandlism Change Log

## 0.9.5

* Fix bug in line extent calculation.
* Fix tooltip bug when trying to display NaN values.

## 0.9.4

* Increase decimals allow in axis labels to 3, from 2
* Fix extent re-calculation for flat line segments.

## 0.9.3

* Fix issue #63
* Fix issue #64

## 0.9.2

* Better algo for deciding if second axis is needed

## 0.9.1

* Fix issue #60.

## 0.9.0

* Second y-Axis. If max extent and min extent of visible lines differ from dualLimit, draw second axis. dualLimit configurable in context.
* Refactor stage. Add prepareToDraw method to wrap all predraw functions.
* Dual yAxis values argument in context.
* Stage can expose values through stage attribute.
* Double brush click to expand.
* Add RHS on legend when line applies to send y-axis.
* Stage respects starte and end date when brush not present.

## 0.8.7

* Context exposes attributes objects.  Attributes have type and key.  Type constrained to 'stage' and 'brush'
* Brush exposes visible end points through context.attributes.
* Brush updates end points attributes when adjusted. 

## 0.8.6

* Bug fix: white space on end points of stage is removed. Send the exact date corresponding the calculated closestIndex, so x-axis domain does not include empty space.

## 0.8.5

* If brush is not present, dont calculate height of canvas (and x axis) using the ratios defined in id.coffee. Use full context height.
* Add utility functions for calculating heights.

## 0.8.4

* Revise y-axis labels. Use k instead of K. Remove space between value and label. Don't alter value unless value >= 10000.
* Padding fixes. Use only ticks and labels from D3 axis. Use CSS borders to fake axis.

## 0.8.3

* Call resetState before drawing and setting scales on toggle.

## 0.8.2

* Add second fallback for recalculating extents to prevent flat lines.
* Reset y axis values when toggle event is triggered (legend click).

## 0.8.1

* attachData renamed to data
* Add support for options.
* Process options that are processable.
* Add callbacks to data and more events.

## 0.8.0

* Basic callback support for adjust action.
* yAxisMin and yAxisMax attributes to override calculated extent.
* Lines are attached and processed through a single function for DRYness.
* Old constructors nuked.

## 0.7.4

* Build file from 0.7.3 was not included in 0.7.3 release. This release simply is a proper build of 0.7.3.

## 0.7.3:

* Check for attributes.show. Don't operate on line visibility if it is not present.

## 0.7.2

* Call line::setup function when merging data to refresh the date value for line data points.
* attributes.show is used to activate columns, NOT disable. This allows frequency/tranformation to be changed on datasets and line visibility to be maintained.

## 0.7.1

* Add build files!!

## 0.7.0

* Simplify build. render and refresh functions now being called inside of update and render functions.
* updateData function added. attachData only called when chart is built for the first time.
* Remove column visibility logic. Column visibility is determined by attributes.show, which is an array of column indicies.

