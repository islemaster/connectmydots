
function edge(nodeA, nodeB) {
  return {
    guidA: nodeA.guid,
    guidB: nodeB.guid,
    connects: function (a, b) {
      return (a.guid === nodeA.guid && b.guid === nodeB.guid)
          || (a.guid === nodeB.guid && b.guid === nodeA.guid);
    }
  };
}
