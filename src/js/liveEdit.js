var dataEditor, scriptEditor, dataSrc, data;

// d3 selector for link elements, modifiable
var linkSelector;

function GraphView() {

}

GraphView.prototype.links = function () {
  return linkSelector;
}

function render(data, target, forceGraph) {
  var width = 1000,
      height = 1000;

  var color = d3.scale.category10();

  var force = d3.layout.force()
    .charge(-4000)
    .linkDistance(100)
    .linkStrength(function (d) {
      if (d.source.id === 0 || d.target.id === 0) {
          return 0.2;
      }
      return 0.9;
    })
    .gravity(0.9)
    .size([width, height]);

  var svg = d3.select(target).append("svg")
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .style('background-color', '#222')
    .call(d3.behavior.zoom().on('zoom', redraw))
    .append('g');

  function redraw() {
    svg.attr(
      "transform",
      "translate(" + d3.event.translate + ") "
          + "scale(" + d3.event.scale + ")");
  }

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


  data.links = data.links.filter(function (l) {
    return !isNodeHidden(data.nodes[l.source])
        && !isNodeHidden(data.nodes[l.target]);
  });

  force
    .nodes(data.nodes)
    .links(data.links)
    .start();

  var link = svg.selectAll(".link")
    .data(data.links)
    .enter().append("line")
    .attr("class", "link");
  linkSelector = link;

  var nodes = svg.selectAll(".node")
    .data(data.nodes);

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
          var currentSelected = selectedNode();
          if (currentSelected && d.guid === currentSelected.guid) {
            selectedNode(null);
          } else {
            selectedNode(d);
          }
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

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    nodeGroup.attr('transform', function (d) {
          return 'translate(' + d.x + ' ' + d.y + ')';
      });

    label
      .attr("x", function(d) { return (d.x > width / 2) ? 10 : -10; })
      .style("text-anchor", function (d) { if (d.x > width / 2) { return 'start'; } else { return 'end'; }});
  });
}

function rebuildGraph() {
  var rawData = dataEditor.getValue();

  if (dataSrc === rawData) {
    return;
  }

  dataSrc = rawData;

  // Put latest raw values in local storage
  localStorage.setItem('data', rawData);

  try {
    data = JSON.parse(dataEditor.getValue());
    var target = document.createElement('div');
    target.className = 'center-column';
    document.forceGraph = d3.layout.force();
    render(data, target, document.forceGraph);
    $('.center-column').replaceWith(target);
    $('#data-parse-status').html('<span class="success">Data parsed successfully</span>');
    $('#output-status').html('Last rendered ' + (new Date()).toLocaleTimeString());
  } catch (e) {
    var errorHtml = '<span class="failure">' + e.name + '</span> ' + e.message;
    $('#data-parse-status').html(errorHtml);
  }
}

$(function () {
  // Set up left-column collapsers
  $('.left-column h1').click(function (event) {
    var targetId = $(event.target).attr('data-for');
    $('.left-column .collapsable:not(#' + targetId + ')').slideUp('fast');
    $('.left-column #' + targetId).slideDown('fast', function () {
      dataEditor.resize();
    });
  });

  $('#ace-data-editor').keyup(rebuildGraph);

  dataEditor = ace.edit('ace-data-editor');
  dataEditor.setTheme('ace/theme/monokai');
  dataEditor.getSession().setMode('ace/mode/json');
  dataEditor.$blockScrolling = Infinity;

  // Try to retrieve previous data and script from local storage
  var storedData = localStorage.getItem('data');
  if (storedData) {
    dataEditor.setValue(storedData);
  }

  rebuildGraph();
});
