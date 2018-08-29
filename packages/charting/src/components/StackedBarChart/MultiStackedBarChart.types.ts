import { IChartProps } from './index';
import { IStyle, ITheme } from 'office-ui-fabric-react/lib/Styling';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';

export interface IMultiStackedBarChartProps {
  /**
   * An array of chart data points for the multistacked bar chart
   */
  data?: IChartProps[];

  /**
   * Width of bar chart
   */
  width?: number;

  /**
   * Height of bar chart
   * @default 15
   */
  barHeight?: number;

  /**
   * Additional CSS class(es) to apply to the StackedBarChart.
   */
  className?: string;

  /**
   * Theme (provided through customization.)
   */
  theme?: ITheme;

  /**
   * This property tells whether to show ratio on top of stacked bar chart or not.
   */
  hideRatio?: boolean[];

  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<IMultiStackedBarChartStyleProps, IMultiStackedBarChartStyles>;
}

export interface IMultiStackedBarChartStyleProps {
  /**
   * Theme (provided through customization.)
   */
  theme: ITheme;

  /**
   * Additional CSS class(es) to apply to the StackedBarChart.
   */
  className?: string;

  /**
   * Width of the chart.
   */
  width: number;

  /**
   * barHeight for each chart
   */
  barHeight?: number;

  /**
   * color of the datapoint legend
   */
  legendColor?: string;
}

export interface IMultiStackedBarChartStyles {
  /**
   * Styling for the root container
   */
  root: IStyle;

  /**
   * Styling for the root container of each chart in the multistacked bar chart
   */
  singleChartRoot: IStyle;

  /**
   * Styling for each item in the container
   */
  items: IStyle;

  /**
   * Styling for each svg in the multistacked bar chart
   */
  chart: IStyle;

  /**
   * Styling for chart title of the stacked bar chart
   */
  chartTitle: IStyle;

  /**
   * Style for the legend card title displayed in the hover card
   */
  hoverCardTextStyles: IStyle;

  /**
   * Style for the data displayed in the hover card
   */
  hoverCardDataStyles: IStyle;

  /**
   * Style for the root of the hover card
   */
  hoverCardRoot: IStyle;
}
