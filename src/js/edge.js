
function edge(nodeA, nodeB) {
  return {
    connects: function (a, b) {
      return (a === nodeA && b === nodeB)
          || (a === nodeB && b === nodeA);
    }
  };
}
