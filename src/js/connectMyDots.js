var nodeListController;

function updateData() {
  var nodes = nodeListController.getNodes();
  var edges = nodeListController.getEdges();
  var i = 0;
  var nodeData = nodes.map(n => $.extend({}, n, {id: i++}));
  var edgeData = edges.map(e => {
    var nodeA = nodeData.find(x => x.guid === e.guidA);
    var nodeB = nodeData.find(x => x.guid === e.guidB);
    return {
      "//": nodeA.name + "-" + nodeB.name,
      "source": nodeA.id,
      "target": nodeB.id,
      "value": 1
    };
  });
  var newData = {
    "nodes": nodeData,
    "links": edgeData
  }
  dataEditor.setValue(JSON.stringify(newData, null, 2));
  rebuildGraph();
}

// Onload
$(function () {
  $('#about').dialog({
    autoOpen: false,
    title: "About Connect My Dots",
    width: 600
  });

  $('.header-row .about').click(() => {
    $('#about').dialog('open');
  });

  $('.header-row .loadDemoContent').click(() => {
    var nodes = [
      {"name":"Alleson Buchanan","guid":0},
      {"name":"Joshua Granberg","guid":1},
      {"name":"Granberg Studios","guid":2},
      {"name":"Made in Vancouver","guid":3},
      {"name":"Columbia Christian Schools","guid":4},
      {"name":"Axis Apartments","guid":5},
      {"name":"Essentia","guid":6},
      {"name":"Stan & Gena Granberg","guid":7},
      {"name":"Mike & Kay Sellers","guid":8},
      {"name":"Harding University","guid":9},
      {"name":"Pratt Fine Arts","guid":10},
      {"name":"Cornish College of the Arts","guid":11},
      {"name":"Brooke Westlund","guid":12},
      {"name":"Seattle University","guid":13},
      {"name":"SU Curatorial (Father Tom)","guid":14},
      {"name":"Carol Wolfe-Clay","guid":15},
      {"name":"Steve (Pratt)","guid":16},
      {"name":"SU Arts Leadership","guid":17},
      {"name":"Kevin Maifeld","guid":18},
      {"name":"Myra Kaha","guid":19},
      {"name":"Laura Hammond","guid":20},
      {"name":"Cultural Access WA","guid":21},
      {"name":"Karen Bystrom","guid":22},
      {"name":"Kelly Tweedle","guid":23},
      {"name":"Ellen Walker","guid":24},
      {"name":"Barbara Grant","guid":25},
      {"name":"Debbi Lewang","guid":26},
      {"name":"Michelle Hasson","guid":27},
      {"name":"Jamie Herlich","guid":28},
      {"name":"Kevin Hughes","guid":29},
      {"name":"Claudia Bach","guid":30},
      {"name":"Woong Jo Chang","guid":31},
      {"name":"Richard Ronald","guid":32},
      {"name":"Kevin Ward","guid":33},
      {"name":"Kathleen Erskind","guid":34},
      {"name":"Joy Langley","guid":35},
      {"name":"Joe McIalwain","guid":36},
      {"name":"Putter Burt","guid":37},
      {"name":"David Brown","guid":38},
      {"name":"Benjamin Moore","guid":39},
      {"name":"Paul Gjording","guid":40},
      {"name":"Katie Jackman","guid":41},
      {"name":"Becky Bogard","guid":42},
      {"name":"Cory Sbarbaro","guid":43},
      {"name":"Jim Kelly","guid":44},
      {"name":"Charlie Rathbun","guid":45},
      {"name":"Kathryn Hedrick","guid":46},
      {"name":"Josh Labelle","guid":47},
      {"name":"Dwight Gee","guid":48},
      {"name":"Mark Gerth","guid":49},
      {"name":"Liisa Spink","guid":50},
      {"name":"Graham Mills","guid":51},
      {"name":"Melody Kudlub-Barr","guid":52},
      {"name":"Puget Sound Group of Northwest Artists","guid":53},
      {"name":"Kathy Troyer","guid":54},
      {"name":"Phillip Levine","guid":55},
      {"name":"Charles Fawcett","guid":56},
      {"name":"Joe Macecky","guid":57},
      {"name":"Randal Southam","guid":58},
      {"name":"Kristina Udall","guid":59},
      {"name":"Linda Hoyt","guid":60},
      {"name":"Eric Richter","guid":61},
      {"name":"Jones Brothers","guid":62},
      {"name":"Jon Poketela","guid":63},
      {"name":"Gary Gumble","guid":64},
      {"name":"Frank Gaffney","guid":65},
      {"name":"Sacha V.","guid":66},
      {"name":"Jamie Moses","guid":67},
      {"name":"Andrew Storms","guid":68},
      {"name":"Charlie McCreary","guid":69},
      {"name":"Ryan Chesla","guid":70},
      {"name":"Angela Bayler","guid":71},
      {"name":"Taylor Alpfelbaum","guid":72},
      {"name":"Cynthia Baiz","guid":73},
      {"name":"Krina Turner","guid":74},
      {"name":"Sasha Reese","guid":75},
      {"name":"Tracey Hyland","guid":76},
      {"name":"Pinky Estelle","guid":77},
      {"name":"Seattle Foundation","guid":78},
      {"name":"Seattle Repertory Theater","guid":79},
      {"name":"Intiman","guid":80}
    ];

    var edges =
    [{"guidA":0,"guidB":1},
{"guidA":0,"guidB":2},
{"guidA":0,"guidB":4},
{"guidA":0,"guidB":5},
{"guidA":0,"guidB":6},
{"guidA":0,"guidB":8},
{"guidA":0,"guidB":10},
{"guidA":0,"guidB":11},
{"guidA":0,"guidB":12},
{"guidA":0,"guidB":13},
{"guidA":0,"guidB":14},
{"guidA":0,"guidB":15},
{"guidA":0,"guidB":16},
{"guidA":0,"guidB":17},
{"guidA":0,"guidB":18},
{"guidA":0,"guidB":19},
{"guidA":0,"guidB":20},
{"guidA":0,"guidB":21},
{"guidA":0,"guidB":22},
{"guidA":0,"guidB":23},
{"guidA":0,"guidB":24},
{"guidA":0,"guidB":25},
{"guidA":0,"guidB":26},
{"guidA":0,"guidB":27},
{"guidA":0,"guidB":28},
{"guidA":0,"guidB":29},
{"guidA":0,"guidB":30},
{"guidA":0,"guidB":31},
{"guidA":0,"guidB":32},
{"guidA":0,"guidB":33},
{"guidA":0,"guidB":34},
{"guidA":0,"guidB":35},
{"guidA":0,"guidB":36},
{"guidA":0,"guidB":37},
{"guidA":0,"guidB":38},
{"guidA":0,"guidB":39},
{"guidA":0,"guidB":40},
{"guidA":0,"guidB":41},
{"guidA":0,"guidB":42},
{"guidA":0,"guidB":43},
{"guidA":0,"guidB":44},
{"guidA":0,"guidB":45},
{"guidA":0,"guidB":46},
{"guidA":0,"guidB":47},
{"guidA":0,"guidB":48},
{"guidA":0,"guidB":49},
{"guidA":0,"guidB":50},
{"guidA":0,"guidB":51},
{"guidA":0,"guidB":52},
{"guidA":0,"guidB":53},
{"guidA":0,"guidB":54},
{"guidA":0,"guidB":55},
{"guidA":0,"guidB":56},
{"guidA":0,"guidB":57},
{"guidA":0,"guidB":58},
{"guidA":0,"guidB":59},
{"guidA":0,"guidB":60},
{"guidA":0,"guidB":61},
{"guidA":0,"guidB":62},
{"guidA":0,"guidB":63},
{"guidA":0,"guidB":64},
{"guidA":0,"guidB":65},
{"guidA":0,"guidB":66},
{"guidA":0,"guidB":67},
{"guidA":0,"guidB":68},
{"guidA":0,"guidB":69},
{"guidA":0,"guidB":70},
{"guidA":0,"guidB":71},
{"guidA":0,"guidB":72},
{"guidA":0,"guidB":73},
{"guidA":0,"guidB":74},
{"guidA":0,"guidB":75},
{"guidA":0,"guidB":76},
{"guidA":0,"guidB":77},
{"guidA":0,"guidB":78},
{"guidA":0,"guidB":79},
{"guidA":0,"guidB":80},
{"guidA":1,"guidB":2},
{"guidA":1,"guidB":3},
{"guidA":1,"guidB":4},
{"guidA":1,"guidB":7},
{"guidA":1,"guidB":8},
{"guidA":1,"guidB":9},
{"guidA":2,"guidB":3},
{"guidA":2,"guidB":4},
{"guidA":2,"guidB":5},
{"guidA":2,"guidB":6},
{"guidA":2,"guidB":7},
{"guidA":2,"guidB":8},
{"guidA":2,"guidB":9},
{"guidA":10,"guidB":16},
{"guidA":10,"guidB":19},
{"guidA":10,"guidB":20},
{"guidA":10,"guidB":21},
{"guidA":10,"guidB":35},
{"guidA":10,"guidB":44},
{"guidA":10,"guidB":45},
{"guidA":10,"guidB":66},
{"guidA":10,"guidB":70},
{"guidA":11,"guidB":17},
{"guidA":11,"guidB":21},
{"guidA":11,"guidB":22},
{"guidA":11,"guidB":24},
{"guidA":11,"guidB":27},
{"guidA":11,"guidB":28},
{"guidA":11,"guidB":29},
{"guidA":11,"guidB":30},
{"guidA":11,"guidB":38},
{"guidA":11,"guidB":39},
{"guidA":11,"guidB":44},
{"guidA":11,"guidB":45},
{"guidA":11,"guidB":50},
{"guidA":11,"guidB":69},
{"guidA":11,"guidB":71},
{"guidA":11,"guidB":77},
{"guidA":11,"guidB":78},
{"guidA":11,"guidB":80},
{"guidA":12,"guidB":15},
{"guidA":13,"guidB":14},
{"guidA":13,"guidB":15},
{"guidA":13,"guidB":17},
{"guidA":13,"guidB":18},
{"guidA":13,"guidB":22},
{"guidA":13,"guidB":23},
{"guidA":13,"guidB":24},
{"guidA":13,"guidB":25},
{"guidA":13,"guidB":26},
{"guidA":13,"guidB":27},
{"guidA":13,"guidB":28},
{"guidA":13,"guidB":29},
{"guidA":13,"guidB":30},
{"guidA":13,"guidB":31},
{"guidA":13,"guidB":32},
{"guidA":13,"guidB":33},
{"guidA":13,"guidB":34},
{"guidA":13,"guidB":36},
{"guidA":13,"guidB":48},
{"guidA":13,"guidB":52},
{"guidA":13,"guidB":66},
{"guidA":13,"guidB":67},
{"guidA":13,"guidB":68},
{"guidA":13,"guidB":69},
{"guidA":13,"guidB":70},
{"guidA":13,"guidB":71},
{"guidA":13,"guidB":72},
{"guidA":13,"guidB":73},
{"guidA":13,"guidB":74},
{"guidA":13,"guidB":75},
{"guidA":13,"guidB":76},
{"guidA":14,"guidB":15},
{"guidA":14,"guidB":18},
{"guidA":15,"guidB":16},
{"guidA":15,"guidB":17},
{"guidA":15,"guidB":18},
{"guidA":15,"guidB":22},
{"guidA":15,"guidB":23},
{"guidA":15,"guidB":24},
{"guidA":15,"guidB":25},
{"guidA":15,"guidB":26},
{"guidA":15,"guidB":27},
{"guidA":15,"guidB":28},
{"guidA":15,"guidB":29},
{"guidA":15,"guidB":30},
{"guidA":15,"guidB":31},
{"guidA":15,"guidB":36},
{"guidA":15,"guidB":50},
{"guidA":15,"guidB":52},
{"guidA":15,"guidB":66},
{"guidA":15,"guidB":67},
{"guidA":15,"guidB":68},
{"guidA":15,"guidB":69},
{"guidA":15,"guidB":70},
{"guidA":15,"guidB":71},
{"guidA":15,"guidB":72},
{"guidA":15,"guidB":73},
{"guidA":15,"guidB":74},
{"guidA":15,"guidB":75},
{"guidA":15,"guidB":76},
{"guidA":16,"guidB":17},
{"guidA":16,"guidB":18},
{"guidA":16,"guidB":19},
{"guidA":16,"guidB":20},
{"guidA":16,"guidB":27},
{"guidA":16,"guidB":28},
{"guidA":16,"guidB":31},
{"guidA":16,"guidB":45},
{"guidA":16,"guidB":66},
{"guidA":17,"guidB":18},
{"guidA":17,"guidB":22},
{"guidA":17,"guidB":23},
{"guidA":17,"guidB":24},
{"guidA":17,"guidB":25},
{"guidA":17,"guidB":26},
{"guidA":17,"guidB":27},
{"guidA":17,"guidB":28},
{"guidA":17,"guidB":29},
{"guidA":17,"guidB":30},
{"guidA":17,"guidB":31},
{"guidA":17,"guidB":32},
{"guidA":17,"guidB":35},
{"guidA":17,"guidB":36},
{"guidA":17,"guidB":37},
{"guidA":17,"guidB":38},
{"guidA":17,"guidB":39},
{"guidA":17,"guidB":44},
{"guidA":17,"guidB":45},
{"guidA":17,"guidB":47},
{"guidA":17,"guidB":50},
{"guidA":17,"guidB":52},
{"guidA":17,"guidB":53},
{"guidA":17,"guidB":66},
{"guidA":17,"guidB":67},
{"guidA":17,"guidB":68},
{"guidA":17,"guidB":69},
{"guidA":17,"guidB":70},
{"guidA":17,"guidB":71},
{"guidA":17,"guidB":72},
{"guidA":17,"guidB":73},
{"guidA":17,"guidB":74},
{"guidA":17,"guidB":75},
{"guidA":17,"guidB":76},
{"guidA":17,"guidB":79},
{"guidA":17,"guidB":80},
{"guidA":18,"guidB":21},
{"guidA":18,"guidB":22},
{"guidA":18,"guidB":23},
{"guidA":18,"guidB":24},
{"guidA":18,"guidB":25},
{"guidA":18,"guidB":26},
{"guidA":18,"guidB":27},
{"guidA":18,"guidB":28},
{"guidA":18,"guidB":29},
{"guidA":18,"guidB":30},
{"guidA":18,"guidB":31},
{"guidA":18,"guidB":32},
{"guidA":18,"guidB":36},
{"guidA":18,"guidB":38},
{"guidA":18,"guidB":39},
{"guidA":18,"guidB":42},
{"guidA":18,"guidB":43},
{"guidA":18,"guidB":44},
{"guidA":18,"guidB":45},
{"guidA":18,"guidB":47},
{"guidA":18,"guidB":49},
{"guidA":18,"guidB":50},
{"guidA":18,"guidB":52},
{"guidA":18,"guidB":66},
{"guidA":18,"guidB":67},
{"guidA":18,"guidB":68},
{"guidA":18,"guidB":69},
{"guidA":18,"guidB":70},
{"guidA":18,"guidB":71},
{"guidA":18,"guidB":72},
{"guidA":18,"guidB":73},
{"guidA":18,"guidB":74},
{"guidA":18,"guidB":75},
{"guidA":18,"guidB":76},
{"guidA":18,"guidB":79},
{"guidA":19,"guidB":20},
{"guidA":20,"guidB":21},
{"guidA":20,"guidB":27},
{"guidA":20,"guidB":28},
{"guidA":20,"guidB":31},
{"guidA":20,"guidB":35},
{"guidA":20,"guidB":66},
{"guidA":20,"guidB":70},
{"guidA":21,"guidB":23},
{"guidA":21,"guidB":24},
{"guidA":21,"guidB":29},
{"guidA":21,"guidB":30},
{"guidA":21,"guidB":35},
{"guidA":21,"guidB":36},
{"guidA":21,"guidB":37},
{"guidA":21,"guidB":38},
{"guidA":21,"guidB":39},
{"guidA":21,"guidB":40},
{"guidA":21,"guidB":41},
{"guidA":21,"guidB":42},
{"guidA":21,"guidB":43},
{"guidA":21,"guidB":44},
{"guidA":21,"guidB":46},
{"guidA":21,"guidB":47},
{"guidA":21,"guidB":48},
{"guidA":21,"guidB":49},
{"guidA":21,"guidB":51},
{"guidA":22,"guidB":23},
{"guidA":22,"guidB":24},
{"guidA":22,"guidB":27},
{"guidA":22,"guidB":28},
{"guidA":22,"guidB":29},
{"guidA":22,"guidB":30},
{"guidA":22,"guidB":31},
{"guidA":22,"guidB":38},
{"guidA":22,"guidB":39},
{"guidA":22,"guidB":44},
{"guidA":22,"guidB":50},
{"guidA":22,"guidB":52},
{"guidA":22,"guidB":66},
{"guidA":22,"guidB":67},
{"guidA":22,"guidB":68},
{"guidA":22,"guidB":71},
{"guidA":22,"guidB":76},
{"guidA":22,"guidB":77},
{"guidA":23,"guidB":24},
{"guidA":23,"guidB":27},
{"guidA":23,"guidB":29},
{"guidA":23,"guidB":31},
{"guidA":23,"guidB":35},
{"guidA":23,"guidB":36},
{"guidA":23,"guidB":37},
{"guidA":23,"guidB":38},
{"guidA":23,"guidB":39},
{"guidA":23,"guidB":40},
{"guidA":23,"guidB":41},
{"guidA":23,"guidB":42},
{"guidA":23,"guidB":43},
{"guidA":23,"guidB":44},
{"guidA":23,"guidB":46},
{"guidA":23,"guidB":47},
{"guidA":23,"guidB":48},
{"guidA":23,"guidB":49},
{"guidA":23,"guidB":50},
{"guidA":23,"guidB":51},
{"guidA":23,"guidB":66},
{"guidA":23,"guidB":67},
{"guidA":23,"guidB":68},
{"guidA":22,"guidB":71},
{"guidA":22,"guidB":76},
{"guidA":24,"guidB":27},
{"guidA":24,"guidB":28},
{"guidA":24,"guidB":29},
{"guidA":24,"guidB":31},
{"guidA":24,"guidB":35},
{"guidA":24,"guidB":36},
{"guidA":24,"guidB":37},
{"guidA":24,"guidB":38},
{"guidA":24,"guidB":39},
{"guidA":24,"guidB":40},
{"guidA":24,"guidB":41},
{"guidA":24,"guidB":43},
{"guidA":24,"guidB":44},
{"guidA":24,"guidB":46},
{"guidA":24,"guidB":47},
{"guidA":24,"guidB":48},
{"guidA":24,"guidB":49},
{"guidA":24,"guidB":50},
{"guidA":24,"guidB":51},
{"guidA":24,"guidB":52},
{"guidA":24,"guidB":69},
{"guidA":24,"guidB":70},
{"guidA":24,"guidB":75},
{"guidA":25,"guidB":26},
{"guidA":25,"guidB":31},
{"guidA":25,"guidB":52},
{"guidA":25,"guidB":66},
{"guidA":25,"guidB":67},
{"guidA":25,"guidB":68},
{"guidA":25,"guidB":69},
{"guidA":25,"guidB":70},
{"guidA":25,"guidB":71},
{"guidA":25,"guidB":72},
{"guidA":25,"guidB":73},
{"guidA":25,"guidB":75},
{"guidA":25,"guidB":76},
{"guidA":26,"guidB":31},
{"guidA":26,"guidB":52},
{"guidA":26,"guidB":66},
{"guidA":26,"guidB":67},
{"guidA":26,"guidB":68},
{"guidA":26,"guidB":71},
{"guidA":26,"guidB":76},
{"guidA":27,"guidB":28},
{"guidA":27,"guidB":29},
{"guidA":27,"guidB":31},
{"guidA":27,"guidB":38},
{"guidA":27,"guidB":39},
{"guidA":27,"guidB":40},
{"guidA":27,"guidB":44},
{"guidA":27,"guidB":50},
{"guidA":27,"guidB":52},
{"guidA":27,"guidB":66},
{"guidA":27,"guidB":67},
{"guidA":27,"guidB":68},
{"guidA":27,"guidB":69},
{"guidA":27,"guidB":70},
{"guidA":27,"guidB":71},
{"guidA":27,"guidB":76},
{"guidA":28,"guidB":29},
{"guidA":28,"guidB":31},
{"guidA":28,"guidB":39},
{"guidA":28,"guidB":41},
{"guidA":28,"guidB":50},
{"guidA":28,"guidB":52},
{"guidA":28,"guidB":66},
{"guidA":28,"guidB":67},
{"guidA":28,"guidB":68},
{"guidA":28,"guidB":69},
{"guidA":28,"guidB":71},
{"guidA":28,"guidB":75},
{"guidA":28,"guidB":76},
{"guidA":28,"guidB":79},
{"guidA":29,"guidB":31},
{"guidA":29,"guidB":35},
{"guidA":29,"guidB":36},
{"guidA":29,"guidB":37},
{"guidA":29,"guidB":38},
{"guidA":29,"guidB":39},
{"guidA":29,"guidB":40},
{"guidA":29,"guidB":41},
{"guidA":29,"guidB":42},
{"guidA":29,"guidB":43},
{"guidA":29,"guidB":44},
{"guidA":29,"guidB":46},
{"guidA":29,"guidB":47},
{"guidA":29,"guidB":48},
{"guidA":29,"guidB":49},
{"guidA":29,"guidB":51},
{"guidA":29,"guidB":52},
{"guidA":29,"guidB":66},
{"guidA":29,"guidB":67},
{"guidA":29,"guidB":68},
{"guidA":29,"guidB":69},
{"guidA":29,"guidB":70},
{"guidA":29,"guidB":71},
{"guidA":29,"guidB":74},
{"guidA":29,"guidB":75},
{"guidA":29,"guidB":76},
{"guidA":30,"guidB":31},
{"guidA":30,"guidB":44},
{"guidA":30,"guidB":52},
{"guidA":30,"guidB":66},
{"guidA":30,"guidB":67},
{"guidA":30,"guidB":68},
{"guidA":30,"guidB":71},
{"guidA":30,"guidB":72},
{"guidA":30,"guidB":76},
{"guidA":31,"guidB":36},
{"guidA":31,"guidB":44},
{"guidA":31,"guidB":52},
{"guidA":31,"guidB":69},
{"guidA":31,"guidB":70},
{"guidA":31,"guidB":71},
{"guidA":31,"guidB":73},
{"guidA":31,"guidB":75},
{"guidA":32,"guidB":52},
{"guidA":32,"guidB":74},
{"guidA":33,"guidB":48},
{"guidA":35,"guidB":36},
{"guidA":35,"guidB":37},
{"guidA":35,"guidB":38},
{"guidA":35,"guidB":39},
{"guidA":35,"guidB":40},
{"guidA":35,"guidB":41},
{"guidA":35,"guidB":42},
{"guidA":35,"guidB":43},
{"guidA":35,"guidB":44},
{"guidA":35,"guidB":46},
{"guidA":35,"guidB":47},
{"guidA":35,"guidB":48},
{"guidA":35,"guidB":49},
{"guidA":35,"guidB":50},
{"guidA":35,"guidB":51},
{"guidA":35,"guidB":66},
{"guidA":36,"guidB":37},
{"guidA":36,"guidB":38},
{"guidA":36,"guidB":39},
{"guidA":36,"guidB":40},
{"guidA":36,"guidB":41},
{"guidA":36,"guidB":42},
{"guidA":36,"guidB":43},
{"guidA":36,"guidB":44},
{"guidA":36,"guidB":46},
{"guidA":36,"guidB":47},
{"guidA":36,"guidB":48},
{"guidA":36,"guidB":49},
{"guidA":36,"guidB":51},
{"guidA":37,"guidB":38},
{"guidA":37,"guidB":39},
{"guidA":37,"guidB":40},
{"guidA":37,"guidB":41},
{"guidA":37,"guidB":42},
{"guidA":37,"guidB":43},
{"guidA":37,"guidB":44},
{"guidA":37,"guidB":46},
{"guidA":37,"guidB":47},
{"guidA":37,"guidB":48},
{"guidA":37,"guidB":49},
{"guidA":37,"guidB":51},
{"guidA":38,"guidB":39},
{"guidA":38,"guidB":40},
{"guidA":38,"guidB":42},
{"guidA":38,"guidB":43},
{"guidA":38,"guidB":44},
{"guidA":38,"guidB":46},
{"guidA":38,"guidB":47},
{"guidA":38,"guidB":48},
{"guidA":38,"guidB":49},
{"guidA":38,"guidB":50},
{"guidA":38,"guidB":51},
{"guidA":39,"guidB":40},
{"guidA":39,"guidB":41},
{"guidA":39,"guidB":42},
{"guidA":39,"guidB":43},
{"guidA":39,"guidB":44},
{"guidA":39,"guidB":46},
{"guidA":39,"guidB":47},
{"guidA":39,"guidB":48},
{"guidA":39,"guidB":49},
{"guidA":39,"guidB":50},
{"guidA":39,"guidB":51},
{"guidA":39,"guidB":66},
{"guidA":39,"guidB":79},
{"guidA":40,"guidB":41},
{"guidA":40,"guidB":42},
{"guidA":40,"guidB":43},
{"guidA":40,"guidB":44},
{"guidA":40,"guidB":46},
{"guidA":40,"guidB":47},
{"guidA":40,"guidB":48},
{"guidA":40,"guidB":49},
{"guidA":40,"guidB":51},
{"guidA":42,"guidB":43},
{"guidA":42,"guidB":44},
{"guidA":42,"guidB":46},
{"guidA":42,"guidB":47},
{"guidA":42,"guidB":48},
{"guidA":42,"guidB":49},
{"guidA":42,"guidB":51},
{"guidA":43,"guidB":44},
{"guidA":43,"guidB":46},
{"guidA":43,"guidB":47},
{"guidA":43,"guidB":48},
{"guidA":43,"guidB":49},
{"guidA":43,"guidB":51},
{"guidA":44,"guidB":45},
{"guidA":44,"guidB":46},
{"guidA":44,"guidB":47},
{"guidA":44,"guidB":48},
{"guidA":44,"guidB":49},
{"guidA":44,"guidB":50},
{"guidA":44,"guidB":51},
{"guidA":44,"guidB":52},
{"guidA":45,"guidB":47},
{"guidA":45,"guidB":49},
{"guidA":45,"guidB":50},
{"guidA":45,"guidB":52},
{"guidA":46,"guidB":47},
{"guidA":46,"guidB":48},
{"guidA":46,"guidB":49},
{"guidA":46,"guidB":51},
{"guidA":47,"guidB":48},
{"guidA":47,"guidB":49},
{"guidA":47,"guidB":51},
{"guidA":47,"guidB":67},
{"guidA":48,"guidB":49},
{"guidA":48,"guidB":51},
{"guidA":49,"guidB":50},
{"guidA":49,"guidB":51},
{"guidA":50,"guidB":69},
{"guidA":50,"guidB":77},
{"guidA":50,"guidB":78},
{"guidA":50,"guidB":80},
{"guidA":51,"guidB":74},
{"guidA":52,"guidB":53},
{"guidA":52,"guidB":54},
{"guidA":52,"guidB":55},
{"guidA":52,"guidB":56},
{"guidA":52,"guidB":57},
{"guidA":52,"guidB":58},
{"guidA":52,"guidB":59},
{"guidA":52,"guidB":60},
{"guidA":52,"guidB":61},
{"guidA":52,"guidB":62},
{"guidA":52,"guidB":63},
{"guidA":52,"guidB":64},
{"guidA":52,"guidB":65},
{"guidA":52,"guidB":66},
{"guidA":52,"guidB":67},
{"guidA":52,"guidB":68},
{"guidA":52,"guidB":71},
{"guidA":52,"guidB":72},
{"guidA":52,"guidB":73},
{"guidA":52,"guidB":74},
{"guidA":52,"guidB":76},
{"guidA":52,"guidB":78},
{"guidA":53,"guidB":54},
{"guidA":53,"guidB":55},
{"guidA":53,"guidB":56},
{"guidA":53,"guidB":57},
{"guidA":53,"guidB":58},
{"guidA":53,"guidB":59},
{"guidA":53,"guidB":60},
{"guidA":53,"guidB":61},
{"guidA":53,"guidB":62},
{"guidA":53,"guidB":63},
{"guidA":53,"guidB":64},
{"guidA":53,"guidB":65},
{"guidA":53,"guidB":72},
{"guidA":53,"guidB":73},
{"guidA":53,"guidB":78},
{"guidA":54,"guidB":55},
{"guidA":54,"guidB":56},
{"guidA":54,"guidB":57},
{"guidA":54,"guidB":58},
{"guidA":54,"guidB":59},
{"guidA":54,"guidB":60},
{"guidA":54,"guidB":61},
{"guidA":54,"guidB":62},
{"guidA":54,"guidB":63},
{"guidA":54,"guidB":64},
{"guidA":54,"guidB":65},
{"guidA":54,"guidB":72},
{"guidA":54,"guidB":73},
{"guidA":55,"guidB":56},
{"guidA":55,"guidB":57},
{"guidA":55,"guidB":58},
{"guidA":55,"guidB":59},
{"guidA":55,"guidB":60},
{"guidA":55,"guidB":61},
{"guidA":55,"guidB":62},
{"guidA":55,"guidB":63},
{"guidA":55,"guidB":64},
{"guidA":55,"guidB":65},
{"guidA":55,"guidB":72},
{"guidA":55,"guidB":73},
{"guidA":56,"guidB":57},
{"guidA":56,"guidB":58},
{"guidA":56,"guidB":59},
{"guidA":56,"guidB":60},
{"guidA":56,"guidB":61},
{"guidA":56,"guidB":62},
{"guidA":56,"guidB":63},
{"guidA":56,"guidB":64},
{"guidA":56,"guidB":65},
{"guidA":56,"guidB":72},
{"guidA":56,"guidB":73},
{"guidA":57,"guidB":58},
{"guidA":57,"guidB":59},
{"guidA":57,"guidB":60},
{"guidA":57,"guidB":61},
{"guidA":57,"guidB":62},
{"guidA":57,"guidB":63},
{"guidA":57,"guidB":64},
{"guidA":57,"guidB":65},
{"guidA":57,"guidB":72},
{"guidA":57,"guidB":73},
{"guidA":58,"guidB":59},
{"guidA":58,"guidB":60},
{"guidA":58,"guidB":61},
{"guidA":58,"guidB":62},
{"guidA":58,"guidB":63},
{"guidA":58,"guidB":64},
{"guidA":58,"guidB":65},
{"guidA":58,"guidB":73},
{"guidA":59,"guidB":60},
{"guidA":59,"guidB":61},
{"guidA":59,"guidB":62},
{"guidA":59,"guidB":63},
{"guidA":59,"guidB":64},
{"guidA":59,"guidB":65},
{"guidA":59,"guidB":73},
{"guidA":60,"guidB":61},
{"guidA":60,"guidB":62},
{"guidA":60,"guidB":63},
{"guidA":60,"guidB":64},
{"guidA":60,"guidB":65},
{"guidA":60,"guidB":72},
{"guidA":60,"guidB":73},
{"guidA":61,"guidB":62},
{"guidA":61,"guidB":63},
{"guidA":61,"guidB":64},
{"guidA":61,"guidB":65},
{"guidA":62,"guidB":63},
{"guidA":62,"guidB":64},
{"guidA":62,"guidB":65},
{"guidA":63,"guidB":64},
{"guidA":63,"guidB":65},
{"guidA":64,"guidB":65},
{"guidA":64,"guidB":72},
{"guidA":64,"guidB":73},
{"guidA":65,"guidB":72},
{"guidA":65,"guidB":73},
{"guidA":66,"guidB":67},
{"guidA":66,"guidB":68},
{"guidA":66,"guidB":69},
{"guidA":66,"guidB":70},
{"guidA":66,"guidB":71},
{"guidA":66,"guidB":75},
{"guidA":66,"guidB":76},
{"guidA":67,"guidB":68},
{"guidA":67,"guidB":69},
{"guidA":67,"guidB":70},
{"guidA":67,"guidB":71},
{"guidA":67,"guidB":76},
{"guidA":67,"guidB":79},
{"guidA":68,"guidB":69},
{"guidA":68,"guidB":70},
{"guidA":68,"guidB":71},
{"guidA":68,"guidB":76},
{"guidA":68,"guidB":79},
{"guidA":69,"guidB":70},
{"guidA":69,"guidB":71},
{"guidA":69,"guidB":75},
{"guidA":69,"guidB":77},
{"guidA":70,"guidB":71},
{"guidA":70,"guidB":75},
{"guidA":71,"guidB":76},
{"guidA":71,"guidB":77},
{"guidA":71,"guidB":79},
{"guidA":72,"guidB":73},
{"guidA":75,"guidB":79},
{"guidA":77,"guidB":80},
{"guidA":78,"guidB":79}];

    if (confirm("Are you sure?  This will overwrite your saved graph!")) {
      nodeListController.setContent(nodes, edges);
    }
  });

  $('.header-row .clearContent').click(() => {
    if (confirm("Are you sure?  This will overwrite your saved graph!")) {
      nodeListController.clearContent();
    }
  });

  nodeListController = NodeList($('#node-list'), updateData);
  nodeListController.render();
  updateData();
});
