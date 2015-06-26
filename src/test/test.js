var assert = require("assert");
var guid = require("../js/utils").guid;
describe('Array', function () {
  it('should remove if predicate is true', function () {
    let array = [1, 2, 3];
    array.removeIf(x => x > 2);
    assert.deepEqual([1,2], array);
  });

  it ('can remove muliple matching elements', function () {
    let array = [1, 2, 3, 4, 5];
    array.removeIf(x => x > 2);
    assert.deepEqual([1,2], array);
  })
});
