/*
  "grayscale" theme (VictoryTheme.grayscale)
  The grayscale is the default theme.
  Try changing it. You could start with `colors` or `fontSize`.
*/

// Colors
const colors = [
  '#252525',
  '#525252',
  '#737373',
  '#969696',
  '#bdbdbd',
  '#d9d9d9',
  '#f0f0f0',
];

const charcoal = '#252525';

// Typography
const sansSerif = 'Lato, sans-serif';
const letterSpacing = 'normal';
const fontSize = 20;

// Layout
const baseProps = {
  width: 450,
  height: 300,
  padding: 50,
  colorScale: colors,
};

// Labels
const baseLabelStyles = {
  fontFamily: sansSerif,
  fontSize,
  letterSpacing,
  padding: 10,
  fill: charcoal,
  stroke: 'transparent',
};

const centeredLabelStyles = {
  textAnchor: 'middle',
  ...baseLabelStyles,
};

// Strokes
const strokeLinecap = 'round';
const strokeLinejoin = 'round';

// Create the theme
const splashTheme = {
  area: {
    style: {
      data: {
        fill: charcoal,
      },
      labels: centeredLabelStyles,
    },
    ...baseProps,
  },
  axis: {
    style: {
      axis: {
        fill: 'transparent',
        stroke: charcoal,
        strokeWidth: 1,
        strokeLinecap,
        strokeLinejoin,
      },
      axisLabel: {...centeredLabelStyles, padding: 25},
      grid: {
        fill: 'transparent',
        stroke: 'transparent',
      },
      ticks: {
        fill: 'transparent',
        size: 1,
        stroke: 'transparent',
      },
      tickLabels: baseLabelStyles,
    },
    ...baseProps,
  },
  bar: {
    style: {
      data: {
        fill: charcoal,
        padding: 10,
        stroke: 'transparent',
        strokeWidth: 0,
        width: 8,
      },
      labels: baseLabelStyles,
    },
    ...baseProps,
  },
  candlestick: {
    style: {
      data: {
        stroke: charcoal,
        strokeWidth: 1,
      },
      labels: centeredLabelStyles,
    },
    candleColors: {
      positive: '#ffffff',
      negative: charcoal,
    },
    ...baseProps,
  },
  chart: baseProps,
  errorbar: {
    style: {
      data: {
        fill: 'transparent',
        stroke: charcoal,
        strokeWidth: 2,
      },
      labels: centeredLabelStyles,
    },
    ...baseProps,
  },
  group: {
    colorScale: colors,
    ...baseProps,
  },
  line: {
    style: {
      data: {
        fill: 'transparent',
        stroke: charcoal,
        strokeWidth: 2,
      },
      labels: {...baseLabelStyles, textAnchor: 'start'},
    },
    ...baseProps,
  },
  pie: {
    style: {
      data: {
        padding: 10,
        stroke: 'transparent',
        strokeWidth: 1,
      },
      labels: {...baseLabelStyles, padding: 20},
    },
    colorScale: colors,
    width: 400,
    height: 400,
    padding: 50,
  },
  scatter: {
    style: {
      data: {
        fill: charcoal,
        stroke: 'transparent',
        strokeWidth: 0,
      },
      labels: centeredLabelStyles,
    },
    ...baseProps,
  },
  stack: {
    colorScale: colors,
    ...baseProps,
  },
  tooltip: {
    style: {
      data: {
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
      },
      labels: centeredLabelStyles,
      flyout: {
        stroke: charcoal,
        strokeWidth: 1,
        fill: '#f0f0f0',
      },
    },
    flyoutProps: {
      cornerRadius: 10,
      pointerLength: 10,
    },
    ...baseProps,
  },
  voronoi: {
    style: {
      data: {
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
      },
      labels: centeredLabelStyles,
    },
    ...baseProps,
  },
};

export default splashTheme;
