## 0.7.0

* Simplify build. render and refresh functions now being called inside of update and render functions.
* updateData function added. attachData only called when chart is built for the first time.
* Remove column visibility logic. Column visibility is determined by attributes.show, which is an array of column indicies.