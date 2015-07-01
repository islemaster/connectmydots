if (!guid) { var guid = require('../js/utils').guid; } // Hacky include pattern
if (!Edge) { var Edge = require('../js/Edge'); } // Hacky include pattern

/**
 * In-memory model of the graph nodes and edges.
 */
export function NetworkGraph() {
  // Nodes
  var nodes = [];
  // Edges
  var edges = [];
  // Change callbacks
  var onChangeCallbacks = [];

  var setContent = function (nodeData, edgeData) {
    nodes = nodeData;
    edges = edgeData;
    onChange();
  };

  var clearContent = function () {
    nodes = [];
    edges = [];
    onChange();
  };

  var addNode = function (nodeName) {
    var newNode = {
      name: nodeName,
      type: 'person',
      date: '1987-08-18',
      guid: guid()
    };
    nodes.push(newNode);
    nodes.sort((a, b) => a.name < b.name ? -1 : 1);
    onChange();
    return newNode;
  };

  var removeNode = function (node) {
    edges.removeIf(x => x.guidA === node.guid || x.guidB === node.guid);
    nodes.removeIf(x => x.guid === node.guid);
    onChange();
  };

  var addEdge = function (left, right) {
    if (!edges.some(e => Edge.connects(e, left, right))) {
      edges.push(Edge.createFromNodes(left, right));
      onChange();
    }
  };

  var removeEdge = function (left, right) {
    edges.removeIf(e => Edge.connects(e, left, right));
    onChange();
  };

  /**
   * @param [callback] added to the list of callbacks for this onChange event.
   *        If omitted, invokes all of the callbacks.
   */
  var onChange = function (callback) {
    if (callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('Bad callback type');
      }
      onChangeCallbacks.push(callback);
    } else {
      onChangeCallbacks.forEach((cb) => { cb(); });
    }
  };

  // Export the public interface
  return {
    getNodes: () => nodes,
    addNode: addNode,
    removeNode: removeNode,
    getEdges: () => edges,
    addEdge: addEdge,
    removeEdge: removeEdge,
    setContent: setContent,
    clearContent: clearContent,
    onChange: onChange
  };
}
