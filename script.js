var width_ = 1600, height_ = 900
var width = 3200, height = 1800
// svg
var svg = d3.select('#content')
    .append('svg')
    .attr('width', width_)
    .attr('height', height_)
    .attr('viewBox', '0 0 3200 1800')

svg.append('defs')
    .append('marker')
    .attr('id', 'triangle')
    .attr('viewBox', "0 -5 10 10")
    .attr('refX', 15)
    .attr('refY', -0.5)
    .attr('markerUnits', 'strokeWidth')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('fill', '#f00')
    .attr('d', 'M0,-5L10,0L0,5');

const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(dataset.links)
    .join('line')
    .attr('marker-end', 'url(#triangle)');

const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(dataset.nodes)
    .join('g')
    .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', (event, d) => (d.fx = event.x, d.fy = event.y))
        .on('end', dragended)
    );

node.append('rect')
    .attr('rx', 8) //rx - the x-axis radius of the ellipse used to round the corners of the rectangle
    .attr('ry', 8) //ry - the y-axis radius of the ellipse used to round the corners of the rectangle
    .attr('width', d => d.name.length * 10)
    .attr('height', 24)
    .attr('fill', '#eee')
    .attr('stroke', '#333')
    .attr('stroke-width', 2);

node.append('text')
    .text(d => d.name)
    .attr('x', d => d.name.length * 5)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    //.attr('dominant-baseline', 'central');

var simulation = d3.forceSimulation(dataset.nodes)
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink(dataset.links).strength(0.1))
    .force("collide", d3.forceCollide().radius(d => d.name.length * 6))
    .force('y', d3.forceY().y(d => (1 - d.weight) * height))
    //.force('x', d3.forceX().x(d => Math.max(0, Math.min(width, d.x))))
    .on('tick', ticked);

function ticked() {
    link.attr('x1', d => d.source.x + d.source.name.length * 5)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x + d.target.name.length * 5)
        .attr('y2', d => d.target.y + 25);

    node.attr('transform', d => `translate(${d.x},${d.y})`);
}

//When the drag gesture starts, the targeted node is fixed to the pointer
//The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
    d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
    d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
    node.attr('stroke', 'black')
}

//the targeted node is released when the gesture ends
function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    node.attr('stroke', null)
}
