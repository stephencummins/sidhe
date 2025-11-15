import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { getCelticFestivals, getCircularPosition, getSeasonColor } from '../lib/celticCalendar';
import type { SavedReading, Sentiment } from '../types';

interface CircularYearCalendarProps {
  readings: SavedReading[];
  year: number;
  colorBy: 'sentiment' | 'accuracy' | 'power';
}

export default function CircularYearCalendar({ readings, year, colorBy }: CircularYearCalendarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!svgRef.current || readings.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 800;
    const height = 800;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2 - 60;
    const innerRadius = outerRadius - 100;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('max-width', '100%')
      .style('height', 'auto');

    const g = svg.append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    // Draw season backgrounds
    const seasons = [
      { name: 'Spring', start: 80, end: 170, color: getSeasonColor('spring') },
      { name: 'Summer', start: 170, end: 260, color: getSeasonColor('summer') },
      { name: 'Autumn', start: 260, end: 350, color: getSeasonColor('autumn') },
      { name: 'Winter (start)', start: 350, end: 360, color: getSeasonColor('winter') },
      { name: 'Winter (end)', start: 0, end: 80, color: getSeasonColor('winter') },
    ];

    const arc = d3.arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    seasons.forEach(season => {
      g.append('path')
        .datum({
          startAngle: (season.start * Math.PI) / 180,
          endAngle: (season.end * Math.PI) / 180,
        })
        .attr('d', arc)
        .attr('fill', season.color)
        .attr('opacity', 0.15)
        .attr('stroke', season.color)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.3);
    });

    // Draw month labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach((month, i) => {
      const angle = (i * 30) - 90; // 30 degrees per month, starting at top
      const rad = (angle * Math.PI) / 180;
      const labelRadius = outerRadius + 30;
      const x = Math.cos(rad) * labelRadius;
      const y = Math.sin(rad) * labelRadius;

      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', '#d4af37')
        .style('font-family', 'Cinzel, serif')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text(month);
    });

    // Draw Celtic festivals
    const festivals = getCelticFestivals(year);
    festivals.forEach(festival => {
      const angle = getCircularPosition(festival.date) - 90;
      const rad = (angle * Math.PI) / 180;
      const markerRadius = (innerRadius + outerRadius) / 2;
      const x = Math.cos(rad) * markerRadius;
      const y = Math.sin(rad) * markerRadius;

      // Festival marker
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 8)
        .attr('fill', '#d4af37')
        .attr('stroke', '#cd7f32')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .append('title')
        .text(festival.name);

      // Festival label (abbreviated)
      const labelRadius = innerRadius - 20;
      const labelX = Math.cos(rad) * labelRadius;
      const labelY = Math.sin(rad) * labelRadius;

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', '#cd7f32')
        .style('font-family', 'Cinzel, serif')
        .style('font-size', '10px')
        .style('pointer-events', 'none')
        .text(festival.name.split(' ')[0]);
    });

    // Plot readings
    const getColor = (reading: SavedReading): string => {
      switch (colorBy) {
        case 'sentiment':
          if (!reading.sentiment) return '#888';
          return reading.sentiment === 'positive' ? '#5DD9C1' :
                 reading.sentiment === 'negative' ? '#ff6b6b' : '#d4af37';
        case 'accuracy':
          if (!reading.accuracy_rating) return '#888';
          const intensity = reading.accuracy_rating / 5;
          return d3.interpolateYlOrRd(intensity);
        case 'power':
          if (!reading.power_score) return '#888';
          const powerIntensity = reading.power_score / 100;
          return d3.interpolateOranges(0.3 + powerIntensity * 0.7);
        default:
          return '#d4af37';
      }
    };

    const getSize = (reading: SavedReading): number => {
      if (colorBy === 'power' && reading.power_score) {
        return 4 + (reading.power_score / 100) * 8; // 4-12px
      }
      return 6;
    };

    readings.forEach(reading => {
      const date = new Date(reading.created_at);
      const angle = getCircularPosition(date) - 90;
      const rad = (angle * Math.PI) / 180;
      const readingRadius = (innerRadius + outerRadius) / 2;
      const x = Math.cos(rad) * readingRadius;
      const y = Math.sin(rad) * readingRadius;

      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', getSize(reading))
        .attr('fill', getColor(reading))
        .attr('stroke', '#1a2332')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('click', () => navigate(`/saved/${reading.id}`))
        .on('mouseover', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', getSize(reading) * 1.5)
            .attr('stroke-width', 2.5);
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', getSize(reading))
            .attr('stroke-width', 1.5);
        })
        .append('title')
        .text(`${reading.title || reading.spread_type}\n${new Date(reading.created_at).toLocaleDateString()}\n${
          reading.power_score ? `Power: ${reading.power_score}` : ''
        }`);
    });

    // Center label
    g.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', '#d4af37')
      .style('font-family', 'Cinzel, serif')
      .style('font-size', '36px')
      .style('font-weight', 'bold')
      .text(year);

  }, [readings, year, colorBy, navigate]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} />
    </div>
  );
}
