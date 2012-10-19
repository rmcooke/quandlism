QuandlismContext_.utility = function() {
  
  var context = this;
  
  function utility() {
    
  }
  
  /**
   * Parses the input date into a readable format for D3
   * String format is a function of the datasets frequency parameter
   *
   * Return a time formatter
   */
  utility.parseDate = function() {   
    dateString = '';
    switch(context.frequency()) {
      case 'daily':
        dateString = '%Y-%m-%d';
        break;
      default:
        throw('Error error');
    }
    return d3.time.format(dateString).parse;
  }
  utility.dateColumn = function(d) {
    if (typeof(d.Year) != 'undefined') {
      return 'Year';
    }
    if (typeof(d.Date != 'undefined')) {
      return 'Date';
    }
    throw('Error - Unknown date column');
  }
  
  
  return utility;
}
