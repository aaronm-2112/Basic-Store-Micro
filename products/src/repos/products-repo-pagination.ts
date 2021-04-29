// purpose: Create a factory method that will take a pagination options struct and return the correct
//          pagination query stratgey object to the calling method. This will make dictating which
//          query should be used for pagination simpler and more extensible.

// extend the products repo base class
// implement the createPaginationStratgey method
//      determine action based on the pagination options struct's sortMethod
//          if sorthMethod == 'price - low-high'
//              check if page is 'next' or 'previous'
//                  return the correct paginationStrategy
//          else if sorthMethod == 'price - high-low'
//              check if page is 'next' or 'previous'
//                  return the correct paginationStrategy
//          else if sorthMethod == 'text'
//              check if page is 'next' or 'previous'
//                  return the correct paginationSratgey
//          else if sorthMethod == 'date'
//              check if page is 'next' or 'previous'
//                  return the correct pagination strategy

// export the class
