export function createFromNodes(nodeA, nodeB) {
  return {
    guidA: nodeA.guid,
    guidB: nodeB.guid
  };
}

export function connects(edge, nodeA, nodeB) {
  return (nodeA.guid === edge.guidA && nodeB.guid === edge.guidB)
      || (nodeA.guid === edge.guidB && nodeB.guid === edge.guidA);
}

var Edge = {
  createFromNodes: createFromNodes,
  connects: connects
};
