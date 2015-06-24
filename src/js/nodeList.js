var nodes = [];
var edges = [];

export function nodeList() {
  return {
    addNode: addNode
  };
}

function addNode(node) {
  nodes.push(node);
}

function addEdge(node, nodeB) {

}
