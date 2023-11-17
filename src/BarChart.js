import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
    const d3Container = useRef(null);
    const tooltip = useRef(null);

    useEffect(() => {
        if (data && d3Container.current) {
            // Set up margins and dimensions for the chart
            const margin = { top: 60, right: 20, bottom: 30, left: 50 };
            const width = 1100 - margin.left - margin.right;
            const height =540 - margin.top - margin.bottom;

            // Clear the previous chart by removing the existing 'g' element, if any
            d3.select(d3Container.current).select("g").remove();

            // Create the SVG container for the chart
            const svg = d3.select(d3Container.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Parse the date and GDP values from the data
            const yearsDate = data.map(item => new Date(item[0]));
            const GDP = data.map(item => item[1]);

            // Set up the x and y scales
            const xScale = d3.scaleTime()
                             .domain([d3.min(yearsDate), d3.max(yearsDate)])
                             .range([0, width]);
            const yScale = d3.scaleLinear()
                             .domain([0, d3.max(GDP)])
                             .range([height, 0]);

            // Add the x-axis
            svg.append("g")
               .attr("transform", `translate(0, ${height})`)
               .attr("id", "x-axis")
               .call(d3.axisBottom(xScale));

            // Add the y-axis
            svg.append("g")
               .attr("id", "y-axis")
               .call(d3.axisLeft(yScale));

            // Create bars for the chart
            svg.selectAll(".bar")
               .data(data)
               .enter().append("rect")
               .attr("class", "bar")
               .attr("x", d => xScale(new Date(d[0])))
               .attr("y", d => yScale(d[1]))
               .attr("width", width / data.length - 0.2)
               .attr("height", d => height - yScale(d[1]))
               .attr("fill", "blue")
               .attr("data-date", d => d[0])
               .attr("data-gdp", d => d[1])
               .on('mouseover', function (event, d) {
                const date = new Date(d[0]);
                const year = date.getFullYear();
                const quarter = Math.ceil((date.getMonth() + 1) / 3);
                const gdpValue = d[1];
         
                d3.select(this).style('fill', 'white');
                d3.select(tooltip.current)
                  .style('opacity', 1)
                  .attr('data-date', d[0]) // Ensure this matches the hovered bar's data-date
                  .html(`${year} Q${quarter}<br>$${gdpValue} Billion`)
                  .style('left', `${event.pageX + 20}px`)
                  .style('top', `${event.pageY - 20}px`);
            })
               .on('mouseout', function () {
                   d3.select(this).style('fill', 'blue');
                   d3.select(tooltip.current).style('opacity', 0);
               });
        }
    }, [data]); // Effect depends on the 'data' prop

    return (
        <div>
            <svg className="bar-chart" ref={d3Container}></svg>
            <div id="tooltip" ref={tooltip} className="tooltip"></div>
        </div>
    );
}

export default BarChart;
