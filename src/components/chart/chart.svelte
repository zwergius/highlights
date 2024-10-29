<script lang="ts">
  import { draw, fade } from 'svelte/transition'
  import LL from '$i18n/i18n-svelte'
  import { tooltip } from '$actions/use-tooltip'
  import { mediaQ, userLocale } from '$stores'
  import type { IntervalKPI } from '$services/kpi'
  import type { graphDataType } from './types'
  import type { TooltipData } from '$components/tooltip'

  export let titles: string[]
  export let data: IntervalKPI

  let svgResponsiveWidth = 903 // this to avoid SSR error
  const leadingTrailing = 40
  const bottom = 20

  let dataKeys: Array<graphDataType>
  let xLabels = []
  let yLabelsLeft = []
  let yLabelsRight = []
  let valuesSet: Array<Array<number>> = []
  let maxValue: number
  let yPoints: number

  const defaultMax = 5000
  const yLeftBaselineValue = 0

  function calcYLabels(values: Array<number>) {
    let maxLabel: number
    const minLabel = 0

    maxValue = Math.max(...values)
    if (maxValue > 0) {
      const maxExponetial = 10 ** (Math.round(Math.log10(maxValue)) - 1)
      maxLabel = Math.ceil(maxValue / maxExponetial) * maxExponetial
    } else {
      maxLabel = defaultMax
    }

    let diff = maxLabel - minLabel
    if (diff % 5 !== 0) {
      maxLabel = Math.ceil(diff / 5) * 5
      diff = maxLabel - minLabel
    }
    let diffExponential = Math.trunc(Math.log10(diff))
    let subtraction = 10 ** diffExponential

    if (diffExponential <= 5) {
      diff = diff / 5
      diffExponential = 10 ** Math.floor(Math.log10(diff))
      subtraction = Math.floor((diff / diffExponential) * diffExponential)
    } else {
      subtraction = diff / 5
    }

    if (maxLabel <= 5) {
      yLabelsLeft = [5, 4, 3, 2, 1]
    } else {
      yLabelsLeft = [...Array(5)].map((_, i) => maxLabel - subtraction * i)
    }
  }

  function initChart() {
    dataKeys = Object.keys(data) as Array<graphDataType>
    xLabels = data[dataKeys[0]].map(([xLabel]) => xLabel)
    yLabelsRight = ['20%', '40%', '60%', '80%', '100%']
    valuesSet = Object.values(data).map((values: Array<[string, number]>) =>
      values.map(([, value]) => value)
    )
    calcYLabels(valuesSet[0])
    yPoints = yLabelsLeft.length + 1
  }

  function chartDimensions(_: any) {
    if ($mediaQ.isSmall) {
      return {
        wChart: 258,
        hChart: 280,
        chartVerticalPadding: 9
      }
    } else if ($mediaQ.isMedium) {
      return {
        wChart: 600,
        hChart: 200,
        chartVerticalPadding: 11
      }
    }
    return {
      wChart: 845,
      hChart: 178,
      chartVerticalPadding: 25
    }
  }

  function round(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100
  }

  function xCoordinate(index: number) {
    const { chartVerticalPadding } = dimensions
    return round(leadingTrailing + chartVerticalPadding + xPointGap * index)
  }

  function yCoordinateLeft(value: number) {
    const chartSpanValue = yLabelsLeft[0] - yLeftBaselineValue
    const yValue = value - yLeftBaselineValue
    const valuesPerPixel = chartSpanValue / chartYBottom
    const yPixel = yValue / valuesPerPixel
    return round(chartYBottom - yPixel)
  }

  function yCoordinateRight(value: number) {
    return round(chartYBottom - (value / 100) * chartYBottom)
  }

  function calcCoordinatesSet(
    valuesSet: Array<Array<number>>,
    _: any
  ): Array<Array<[number, number, number]>> {
    const [graph1 = [], graph2 = []] = valuesSet
    const graph1Coordinates: Array<[number, number, number]> = graph1.map((value, i) => [
      xCoordinate(i),
      yCoordinateLeft(value),
      value
    ])
    const graph2Coordinates: Array<[number, number, number]> = graph2.map((value, i) => [
      xCoordinate(i),
      yCoordinateRight(value),
      value
    ])
    return [graph1Coordinates, graph2Coordinates]
  }

  function polylinePoints(coordinates: Array<[number, number, number]>) {
    return coordinates.map(([x, y]) => `${x},${y}`).join(' ')
  }

  function formattedLabel(dateString: string) {
    const date = new Date(dateString)
    return userLocale.formatDate(date, { day: 'numeric', month: 'numeric' })
  }

  function tooltipData(index: number): TooltipData {
    const [date, impressions] = data.impressions[index]
    const [, viewability] = data.viewability[index]

    return {
      title: userLocale.formatDate(new Date(date)),
      rows: [
        [$LL.campaignsTable.impressions(), userLocale.formatNumber(impressions)],
        [$LL.campaignsTable.viewability(), `${userLocale.formatNumber(viewability)}%`]
      ]
    }
  }

  $: if (data) {
    initChart()
  }
  $: dimensions = chartDimensions($mediaQ)
  $: xPointGap = +(dimensions.wChart / (xLabels.length - 1)).toFixed(2)
  $: xCoefficient = leadingTrailing + dimensions.chartVerticalPadding
  $: svgW = dimensions.wChart + 2 * leadingTrailing + 2 * dimensions.chartVerticalPadding
  $: svgH = (dimensions.hChart + bottom) * aspectScale
  $: chartYBottom = Math.round((svgH / yPoints) * (yPoints - 1))
  $: aspectScale = +(svgW / svgResponsiveWidth).toFixed(2)
  $: coordinatesSet = calcCoordinatesSet(valuesSet, chartYBottom)
</script>

<div class="container">
  <h3>
    {#each titles as title, index (index)}
      <span>
        <svg width="10" height="10">
          <circle cx="5" cy="5" r="5" />
        </svg>
        {title}
      </span>
      {#if titles.length !== index + 1}
        {'/'}
      {/if}
    {/each}
  </h3>

  <div class="svg-wrapper" bind:clientWidth={svgResponsiveWidth} style="--scale: {aspectScale}">
    <svg class="graph" viewBox="0 0 {svgW} {svgH}">
      {#if data}
        <!-- x axis lines -->
        <g class="horizontal">
          {#each Array(yPoints) as _, index (index)}
            {@const y = Math.round((svgH / yPoints) * index)}
            <line x1="0" x2={svgW} y1={y} y2={y} />
          {/each}
        </g>

        <!-- x axis labels & markers-->
        <g class="x-axis">
          {#each xLabels as label, index (index)}
            {@const x = round(xCoefficient + xPointGap * index)}
            <text {x} y={chartYBottom + 20 * aspectScale}>{formattedLabel(label)}</text>
            <line x1={x} x2={x} y1={chartYBottom} y2={chartYBottom + 3} />
          {/each}
        </g>

        <!-- y axis -->
        <line x1={leadingTrailing} x2={leadingTrailing} y1="0" y2={chartYBottom} />
        <g class="y left" transform="translate(35, {15 * aspectScale})">
          {#each yLabelsLeft as label, index (index)}
            {@const y = Math.round((svgH / yPoints) * index)}
            <text {y}>{userLocale.formatNumber(Number(label))}</text>
          {/each}
        </g>

        <line x1={svgW - leadingTrailing} x2={svgW - leadingTrailing} y1="0" y2={chartYBottom} />
        <g
          class="y right"
          transform="translate({svgW - (leadingTrailing - 5)}, {15 * aspectScale})"
        >
          {#each yLabelsRight.reverse() as label, index (index)}
            {@const y = Math.round((svgH / yPoints) * index)}
            <text {y}>{label}</text>
          {/each}
        </g>

        {#if maxValue > 0}
          <g class="data">
            {#each coordinatesSet as coordinates, index (index)}
              {@const circleDuration = 100}
              {@const circlesDelay = circleDuration * coordinates.length}
              <g class="data-set">
                <polyline in:draw={{ delay: circlesDelay }} points={polylinePoints(coordinates)} />
                {#each coordinates as [cx, cy, value], cIndex (cIndex)}
                  <circle
                    {cx}
                    {cy}
                    r={2.5 * aspectScale}
                    data-value={value}
                    in:fade={{
                      duration: circleDuration,
                      delay: circleDuration * cIndex
                    }}
                    use:tooltip={{
                      data: tooltipData(cIndex)
                    }}
                  />
                {/each}
              </g>
            {/each}
          </g>
        {/if}
      {/if}
    </svg>
  </div>
</div>

<style>
  div.container {
    --graph-color-1: hsla(var(--theme-colors-blue));
    --graph-color-2: hsla(var(--theme-colors-yellow-light));
    background-color: var(--bg-dashboard-container);
    border-radius: 15px;
    width: 100%;
  }

  h3 {
    padding: var(--spacer205) var(--spacer3075) var(--spacer3);
  }

  h3,
  h3 span {
    --color: var(--graph-color-1);
    font-size: var(--ts-sm);
    font-weight: 500;
    display: flex;
    gap: var(--spacer062);
    align-items: center;
    fill: var(--color);
  }

  h3 span:nth-child(2) {
    --color: var(--graph-color-2);
  }

  .svg-wrapper {
    position: relative;
    padding: 0 var(--spacer3075) var(--spacer205);
  }

  svg.graph {
    /* margin: var(--spacer5); */
    overflow: visible;
  }

  line {
    stroke: var(--border-table-row);
  }

  .horizontal line:last-of-type {
    stroke: var(--font-table-header);
  }

  polyline {
    fill: none;
    stroke: black;
  }

  text {
    font-size: calc(var(--ts-xxxs) * var(--scale));
    fill: var(--font-table-header);
  }

  .x-axis text {
    text-anchor: middle;
  }

  .x-axis line {
    stroke: var(--font-table-header);
  }

  .y text {
    text-anchor: end;
  }

  .y.right text {
    text-anchor: start;
  }

  .data {
    --color: var(--graph-color-1);
    stroke-width: 1px;
  }

  .data circle {
    fill: var(--color);
    stroke: transparent;
    stroke-width: 10;
  }

  .data polyline {
    stroke-width: calc(2px * var(--scale));
    stroke: var(--color);
    filter: drop-shadow(0px 14px 8px var(--color));
  }

  .data > g:nth-child(2) {
    --color: var(--graph-color-2);
  }

  /* Tablet - portrait - 1280px */
  @media only screen and (max-width: 1279px) {
  }
  /* Handheld - 768px */
  @media only screen and (max-width: 767px) {
    .svg-wrapper {
      padding: 0 var(--spacer1025);
    }
  }
</style>
