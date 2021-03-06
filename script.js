const colors = [
    '#61EE65',
    '#C93B5F',
    '#DB6503',
    '#40FDC4',
    '#5496B3',
    '#21B5CA',
    '#C1032C',
    '#CE5987',
    '#E2ABFA',
    '#66F51E',
    '#66F51E',
    '#18EBD3',
    '#49FB1D',
    '#F372BB',
    '#F55CB5',
    '#816E95',
    '#DE7325',
    '#A02091',
    '#EFFE4E',
]
const category = []

const w = 1000;
const h = 500;
const wl = 400;
const hl = 600;
const padding = 50;
const graph = d3.select('#graph').append('svg').attr('width', w).attr('height', h)
const tooltip = d3.select('#tooltip').style('opacity', 0).attr('data-value', '')
const legend = d3.select('#legend').append('svg').attr('width', wl).attr('height', hl)
fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json')
    .then(response => response.json())
    .then(data => {

        data.children.forEach(val => {
            category.push(val.name)
        })

        const root = d3.hierarchy(data).sum(function (d) { return d.value })
        d3.treemap()
            .size([w, h])
            .padding(1)
            (root)

        graph.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .style("fill", d => colors[category.indexOf(d.data.category)])
            .attr('class', 'tile')
            .attr('data-name', d => d.data.name)
            .attr('data-category', d => d.data.category)
            .attr('data-value', d => d.data.value)
            .on('mouseover', function (even, d) {
                d3.select(this).style('stroke', '#5e0080')
                tooltip.style('opacity', 1)
                    .attr('data-value', d.data.value)
                    .html(
                        d.data.name + '<br>Value: ' + d.data.value + '<br>Cat: ' + d.data.category
                    )
                    .style('left', (even.pageX + 20) + 'px')
                    .style('top', even.pageY + 'px')
            })
            .on('mouseout', function (even, d) {
                d3.select(this).style('stroke', 'none')
                tooltip.style('opacity', 0)
                    .attr('data-value', '')
                    .text('')
                    .style('left', '0px')
                    .style('top', '0px')
            })
        graph.selectAll('text')
            .data(root.leaves())
            .enter()
            .append('text')
            .attr('x', d => d.x0 + 10)
            .attr('y', d => d.y0 + 30)
            .attr('font-size', '5px')
            .attr('fill', 'white')
            .text(d => d.data.name)

        const size = 20;
        legend.selectAll('rect')
            .data(category)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', (d, i) => i * (size + 5))
            .attr('width', size)
            .attr('height', size)
            .attr('class', 'legend-item')
            .attr('fill', d => colors[category.indexOf(d)])
        legend.selectAll('text')
            .data(category)
            .enter()
            .append('text')
            .attr("x", size * 1.2)
            .attr("y", (d, i) => i * (size + 5) + (size / 2))
            .attr('fill', d => colors[category.indexOf(d)])
            .text(d => d)

    })