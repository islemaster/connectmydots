var assert = require("assert");
var seedrandom = require('seedrandom');
import { NetworkGraph } from '../js/NetworkGraph';

describe('NetworkGraph', function () {
  var graph;
  beforeEach(() => {
    // Override Math.random so that tests give reproducible results
    // See https://www.npmjs.com/package/seedrandom
    seedrandom('nonrandom test seed', { global: true });
    graph = NetworkGraph();
  });

  it('allows adding a node', () => {
    graph.addNode('Brad');
    assert.deepEqual(
      [
        {
          "name":"Brad",
          "type":"person",
          "date":"1987-08-18",
          "guid":"4bbb85df-4f6d-bbf6-fee7-48cff33295a0",
          "notes":""
        }
      ],
      graph.getNodes()
    );
  });

  it('keeps nodes sorted', () => {
    graph.addNode('c');
    graph.addNode('a');
    graph.addNode('d');
    graph.addNode('b');
    assert.deepEqual(
      ['a', 'b', 'c', 'd'],
      graph.getNodes().map(n => n.name)
    );
  });

  it('uses case-insensitive sorting', () => {
    graph.addNode('C');
    graph.addNode('a');
    graph.addNode('d');
    graph.addNode('B');
    assert.deepEqual(
      ['a', 'B', 'C', 'd'],
      graph.getNodes().map(n => n.name)
    );
  });

  it('allows two nodes with same name', () => {
    var nodeA = graph.addNode('Alleson');
    var nodeB = graph.addNode('Alleson');
    assert.equal(2, graph.getNodes().length);
    assert.notDeepEqual(nodeA, nodeB);
  });

  it('allows removing a node', () => {
    var reggie = graph.addNode('Reggie');
    assert.equal(1, graph.getNodes().length);
    graph.removeNode(reggie);
    assert.equal(0, graph.getNodes().length);
  });

  it('no-op on removing nonexistent node', () => {
    var brad = graph.addNode('Brad');
    var alleson = graph.addNode('Alleson');
    var reggie = graph.addNode('Reggie');
    assert.equal(3, graph.getNodes().length);
    graph.removeNode(brad);
    assert.equal(2, graph.getNodes().length);
    // Second remove attempt is a no-op
    graph.removeNode(brad);
    assert.equal(2, graph.getNodes().length);
  });

  it('allows adding an edge', () => {
    var brad = graph.addNode('Brad');
    var alleson = graph.addNode('Alleson');
    graph.addEdge(brad, alleson);
    assert.equal(1, graph.getEdges().length);
  });

  it('does not allow re-adding an edge', () => {
    var brad = graph.addNode('Brad');
    var alleson = graph.addNode('Alleson');
    graph.addEdge(brad, alleson);
    assert.equal(1, graph.getEdges().length);
    graph.addEdge(brad, alleson);
    assert.equal(1, graph.getEdges().length);
    graph.addEdge(alleson, brad);
    assert.equal(1, graph.getEdges().length);
  });

  it('allows removing an edge', () => {
    var brad = graph.addNode('Brad');
    var alleson = graph.addNode('Alleson');
    graph.addEdge(brad, alleson);
    assert.equal(1, graph.getEdges().length);
    graph.removeEdge(brad, alleson);
    assert.equal(0, graph.getEdges().length);
  });

  it('allows removing an edge by reversed reference', () => {
    var brad = graph.addNode('Brad');
    var alleson = graph.addNode('Alleson');
    graph.addEdge(brad, alleson);
    assert.equal(1, graph.getEdges().length);
    graph.removeEdge(alleson, brad);
    assert.equal(0, graph.getEdges().length);
  });

  it('no-op on removing nonexistent edge', () => {
    var brad = graph.addNode('Brad');
    var alleson = graph.addNode('Alleson');
    var reggie = graph.addNode('Reggie');
    graph.addEdge(brad, alleson);
    assert.equal(1, graph.getEdges().length);
    graph.removeEdge(reggie, brad);
    assert.equal(1, graph.getEdges().length);
  });

  it('removing a node removes its edges too', () => {
    var brad = graph.addNode('Brad');
    var alleson = graph.addNode('Alleson');
    var reggie = graph.addNode('Reggie');
    graph.addEdge(brad, alleson);
    graph.addEdge(brad, reggie);
    graph.addEdge(alleson, reggie);
    assert.equal(3, graph.getEdges().length);
    graph.removeNode(brad);
    assert.equal(1, graph.getEdges().length);
  });
});
