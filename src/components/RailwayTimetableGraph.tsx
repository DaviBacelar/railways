import React, {useEffect, useRef} from 'react';
import RailwayGraphDataSeriesLineInteface from "@/interfaces/RailwayGraphDataSeriesLineInteface";
import RailwayGraphDataSeriesInterface from "@/interfaces/RailwayGraphDataSeriesInterface";
import * as d3 from "d3";


interface Props {
    times: string[];
    stations: string[];
    data: RailwayGraphDataSeriesInterface[];
    width: number;
    height: number;
}

const RailwayTimetableGraph: React.FC<Props> = ({times, stations, data, width, height}) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const createSVG = (marginLeft: number, marginTop: number) => {
        return d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${marginLeft}, ${marginTop})`);
    }

    const createXBand = (times: string[], svgHeight: number) => {
        return d3
            .scaleTime()
            .domain(d3.extent(times, d => new Date(d)) as [Date, Date])
            .range([0, svgHeight]);
    };

    const createYBand = (stations: string[], svgWidth: number) => {
        return d3
            .scaleBand()
            .domain(stations.map(d => d))
            .range([0, svgWidth])
            .padding(0.1);
    }

    const plotXAxis = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, x: d3.ScaleTime<number, number, never>) => {
        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, 0)`)
            .call(d3.axisTop(x));
    };

    const plotYAxis = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, y: d3.ScaleBand<string>) => {
        svg
            .append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y));
    };

    const createLine = (x: d3.ScaleTime<number, number, never>, y: d3.ScaleBand<string>) => {
        return d3
            .line<RailwayGraphDataSeriesLineInteface>()
            .x(d => x(new Date(d.time)))
            .y(d => y(d.label)! + y.bandwidth() / 2);
    };

    const addVerticalGridLines = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, x: d3.ScaleTime<number, number, never>, svgHeight: number) => {
        return svg
            .selectAll('.horizontal-grid-line')
            .data(x.ticks())
            .enter()
            .append('line')
            .attr('class', 'horizontal-grid-line')
            .attr('x1', d => x(new Date(d)))
            .attr('y1', 0)
            .attr('x2', d => x(new Date(d)))
            .attr('y2', svgHeight)
            .attr('stroke', 'lightgray')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4');
    };

    const addHorizontalGridLines = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, y: d3.ScaleBand<string>, svgWidth: number) => {
        return svg
            .selectAll('.vertical-grid-line')
            .data(stations.map(d => d))
            .enter()
            .append('line')
            .attr('class', 'vertical-grid-line')
            .attr('x1', 0)
            .attr('y1', d => y(d)! + y.bandwidth() / 2)
            .attr('x2', svgWidth)
            .attr('y2', d => y(d)! + y.bandwidth() / 2)
            .attr('stroke', 'lightgray')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4');
    }

    const plotLines = (
        svg: d3.Selection<SVGGElement, unknown, null, undefined>,
        line: any,
        lineData: RailwayGraphDataSeriesInterface
    ) => {
        svg
            .append('path')
            .datum(lineData.values)
            .attr('fill', 'none')
            .attr('stroke', lineData.color)
            .attr('stroke-width', 1)
            .attr('d', line);
    };

    const insertLabelOnLine = (
        svg: d3.Selection<SVGGElement, unknown, null, undefined>,
        x: d3.ScaleTime<number, number, never>,
        y: d3.ScaleBand<string>,
        lineData: RailwayGraphDataSeriesInterface
    ) => {
        lineData.values.forEach((point, index) => {
            if (index > 0) {
                const midpointX = (x(new Date(lineData.values[index - 1].time))! + x(new Date(point.time))!) / 2;
                const midpointY = (y(lineData.values[index - 1].label)! + y(point.label)!) / 2;

                svg
                    .append('text')
                    .attr('class', 'line-name')
                    .attr('x', midpointX)
                    .attr('y', midpointY)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .style('fill', lineData.color)
                    .style('font-size', '5px')
                    .text(lineData.trip_headsign);
            }
        });
    }

    useEffect(() => {
        if(!svgRef.current || data.length === 0 || data[0].values.length === 0) {
            return;
        }

        const margin = { top: 50, right: 50, bottom: 50, left: 135 };
        const svgWidth = width - margin.left - margin.right;
        const svgHeight = height - margin.top - margin.bottom;
        const svg = createSVG(margin.left, margin.top);
        const x = createXBand(times, svgWidth);
        const y = createYBand(stations, svgHeight);
        const line = createLine(x, y);

        plotXAxis(svg, x);
        plotYAxis(svg, y);
        addVerticalGridLines(svg, x, svgHeight);
        addHorizontalGridLines(svg, y, svgWidth);

        data.forEach((lineData) => {
            plotLines(svg, line, lineData);
            insertLabelOnLine(svg, x, y, lineData);
        });

        return () => {
            svg.selectAll('*').remove();
        }
    }, [data, height, width]);

    return (
        <svg ref={svgRef}></svg>
    );
}

export default RailwayTimetableGraph;
