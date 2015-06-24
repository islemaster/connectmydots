var GraphRenderer = (function () {

  var width = 1000,
      height = 1000;

  var nodeData = [
    {
        "name":"Alleson Buchanan",
        "id":0,
        "group":1,
        "date":"1987-08-18"
    },
    {
        "name":"Joshua Granberg",
        "id":1,
        "group":1,
        "date":"2001-09-01"
    },
    {
        "name":"Granberg Studios",
        "id":2,
        "group":2,
        "date":"2011-08-01"
    },
    {
        "name":"Made in Vancouver",
        "id":3,
        "group":2,
        "date":"2013-08-01",
        "note":"Good weak tie example"
    },
    {
        "name":"Columbia Christian Schools",
        "id":4,
        "group":2,
        "date":"2001-09-01"
    },
    {
        "name":"Axis Apartments",
        "id":5,
        "group":2,
        "date":"2013-09-01"
    },
    {
        "name":"Essentia",
        "id":6,
        "group":2,
        "date":"2015-02-01"
    },
    {
        "name":"Stan & Gena Granberg",
        "id":7,
        "group":1,
        "date":"2013-08-01"
    },
    {
        "name":"Mike & Kay Sellers",
        "id":8,
        "group":1,
        "date":"2011-01-01"
    },
    {
        "name":"Harding University",
        "id":9,
        "group":2,
        "date":"2005-09-01"
    },
    {
        "name":"Pratt Fine Arts",
        "id":10,
        "group":2,
        "date":"2013-12-01"
    }
  ];

  var links = [
    {"Alleson":"",
     "source":0,"target":1,"value":2},
    {"source":0,"target":2,"value":2},
    {"source":0,"target":4,"value":1},
    {"source":0,"target":5,"value":1},
    {"source":0,"target":6,"value":1},
    {"source":0,"target":8,"value":1},
    {"source":0,"target":10,"value":1},

    {"Josh":"",
     "source":1,"target":2,"value":2},
    {"source":1,"target":3,"value":1},
    {"source":1,"target":4,"value":1},
    {"source":1,"target":7,"value":1},
    {"source":1,"target":8,"value":1},
    {"source":1,"target":9,"value":1},

    {"GS":"",
     "source":2,"target":3,"value":1},
    {"source":2,"target":4,"value":1},
    {"source":2,"target":5,"value":1},
    {"source":2,"target":6,"value":1},
    {"source":2,"target":7,"value":1},
    {"source":2,"target":8,"value":1},
    {"source":2,"target":9,"value":1},
  ];

  var rootGroup;

  var color = d3.scale.category10();
  var force = d3.layout.force();
  force.charge(-4000)
      .linkDistance(100)
      .linkStrength(function (d) {
        if (d.source.id === 0 || d.target.id === 0) {
            return 0.2;
        }
        return 0.9;
      })
      .gravity(0.9)
      .size([width, height]);


  function isNodeHidden(node) {
    var hiddenNodes = [
      //0, // Alleson
    ];

    var hiddenGroups = [
      //2, // Organizations
    ];

    var hideNodesAfterDate = '2019-01-01';
    if (node.date && Date.parse(node.date) > Date.parse(hideNodesAfterDate)) {
        return true;
    }

    if (hiddenGroups.some(function (hiddenGroup) {
        return node.group === hiddenGroup;
    })) {
        return true;
    }

    return hiddenNodes.some(function (hiddenID) {
      return node.id === hiddenID;
    });
  }

  /**
   * Handler on the SVG element that controls pan and zoom behavior.
   */
  var onGraphPanOrZoom = function () {
    rootGroup.attr("transform", "translate(" + d3.event.translate + ") "
          + "scale(" + d3.event.scale + ")");
  }

  /**
   * Redraw the graph
   */
  var render = function () {

    // Create a whole new SVG element in a new div that we'll swap out.
    var target = document.createElement('div');
    target.className = 'center-column';
    rootGroup = d3.select(target).append("svg")
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .style('background-color', '#222') // TODO: Move to stylesheet
        .call(d3.behavior.zoom().on('zoom', onGraphPanOrZoom))
        .append('g');

    var filteredLinks = links.filter(function (l) {
      return !isNodeHidden(nodeData[l.source])
          && !isNodeHidden(nodeData[l.target]);
    });

    force
      .nodes(nodeData)
      .links(links)
      .start();
    updateGraph();


    force.on("tick", function() {
      var link = rootGroup.selectAll(".link");
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      var nodeGroup = rootGroup.selectAll(".node").selectAll("g");
      nodeGroup.attr('transform', function (d) {
            return 'translate(' + d.x + ' ' + d.y + ')';
        });

      var label = nodeGroup.selectAll("text");
      label
        .attr("x", function(d) { return (d.x > width / 2) ? 10 : -10; })
        .style("text-anchor", function (d) { if (d.x > width / 2) { return 'start'; } else { return 'end'; }});
    });

    $('.center-column').replaceWith(target);

    $('#output-status').html('Last rendered ' + (new Date()).toLocaleTimeString());

  };

  /**
   * Make all the UI sliders reflect the actual graph values.
   */
  var coerceSlidersToGraphValues = function () {
    $('#gravity-slider').slider('option', 'value', force.gravity() * 100);
    $('#charge-slider').slider('option', 'value', force.charge());
    $('#link-distance-slider').slider('option', 'value', force.linkDistance());
    $('#link-strength-slider').slider('option', 'value', force.linkStrength());
  };

  var updateGraph = function () {
    var link = rootGroup.selectAll(".link")
      .data(links);
    link.enter().append("line")
      .attr("class", "link");
    link.exit().remove();

    var nodes = rootGroup.selectAll(".node")
      .data(nodeData);
    nodes.exit().remove();

    var nodeGroup = nodes.enter().append('g')
        .attr('class', 'node-group')
        .attr('data-node-id', function (d) { return d.id; })
        .style('display', function (d) {
            if (isNodeHidden(d)) {
                return 'none';
            }
            return '';
        })
        .call(force.drag)
        .on('click', function (d) {
            link.classed('hover', function (l) {
               return l.source.id === d.id
                   || l.target.id === d.id;
            });
        })
        .on('mouseout', function () {
            //link.classed('hover', false);

        })

    var node = nodeGroup.append("circle")
      .attr("class", "node")
      .attr('cx', 0)
      .attr('cy', 0)
      .attr("r", 7)
      .style("fill", function(d) {
          if (d.group > 1) {
              return '#BD4932';
          }
          return '#105B63';
      })
      .style("stroke", "#FFFAD5");

    var label = nodeGroup.append("text")
      .text(function (d) {
          if (d.group === 1) {
            return d.name.split(' ')[0];
          }
          return d.name;
      })
      .attr('y', 5)
      .style('font-weight', 'bold')
      .style('fill', '#FFFAD5')
      .style('stroke', function(d) {
          if (d.group > 1) {
              return '#BD4932';
          }
          return '#105B63';
      })
      .style('stroke-width', 0.5);

    force.start();
  };

  var addNode = function (nodeName) {
    var newID = nodeData.length;
    nodeData.push({
      "name":nodeName,
      "id":newID,
      "group":1,
      "date":"1899-01-01"
    });
    links.push({
      "source":0,
      "target":newID,
      "value":1
    });
    updateGraph();
  };

  return {
    nodeData: nodeData,
    render: render,
    coerceSlidersToGraphValues: coerceSlidersToGraphValues,
    addNode: addNode
  };
})();

$(function () {
  GraphRenderer.render();
  GraphRenderer.coerceSlidersToGraphValues();

  var list = $('<ul>').appendTo($('#node-list'));
  GraphRenderer.nodeData.forEach(function (n) {
    $('<li>').text(n.name).click(function () {
      alert(n.id + ' ' + n.group + ' ' + n.date);
    }).appendTo(list);
  });
  $('<input type="button">').val('New Node').click(function () {
    GraphRenderer.addNode('New Node');
  }).appendTo($('#node-list'));
});
