import * as React from 'react';
import { IProcessedStyleSet, IPalette } from 'office-ui-fabric-react/lib/Styling';
import { classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { ILegend, Legends } from '../Legends/index';
import { IChartDataPoint, IChartProps } from './index';
import { IStackedBarChartProps, IStackedBarChartStyleProps, IStackedBarChartStyles } from './StackedBarChart.types';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';

const getClassNames = classNamesFunction<IStackedBarChartStyleProps, IStackedBarChartStyles>();

export interface IRefArrayData {
  legendText?: string;
  refElement?: SVGGElement;
}

export interface IStackedBarChartState {
  isCalloutVisible: boolean;
  refArray: IRefArrayData[];
  legendSelected: string;
  refSelected: SVGGElement | null | undefined;
  dataForHoverCard: number;
  color: string;
}

export class StackedBarChartBase extends React.Component<IStackedBarChartProps, IStackedBarChartState> {
  public static defaultProps: Partial<IStackedBarChartProps> = {
    barHeight: 16,
    hideNumberDisplay: false,
    hideLegend: false,
    isMultiStackedBarChart: false
  };
  private _classNames: IProcessedStyleSet<IStackedBarChartStyles>;

  public constructor(props: IStackedBarChartProps) {
    super(props);
    this.state = {
      isCalloutVisible: false,
      refArray: [],
      legendSelected: '',
      refSelected: null,
      dataForHoverCard: 0,
      color: ''
    };
    this._onLeave = this._onLeave.bind(this);
    this._refCallback = this._refCallback.bind(this);
  }

  public render(): JSX.Element {
    this._adjustProps();
    const { data, barHeight, hideNumberDisplay, hideLegend, theme } = this.props;
    const { palette } = theme!;
    const bars = this._createBarsAndLegends(data!, barHeight!, palette);
    const showRatio = hideNumberDisplay === false && data!.chartData!.length === 2;
    const showNumber = hideNumberDisplay === false && data!.chartData!.length === 1;
    let total = 0;
    if (showRatio === true) {
      total = data!.chartData!.reduce((acc: number, value: IChartDataPoint) => acc + (value.data ? value.data : 0), 0);
    }
    const showLegend = hideLegend === false && data!.chartData!.length > 2;
    const { isCalloutVisible } = this.state;
    return (
      <div className={this._classNames.root}>
        <div className={this._classNames.chartTitle}>
          {data!.chartTitle && (
            <div>
              <strong>{data!.chartTitle}</strong>
            </div>
          )}
          {showRatio && (
            <div>
              <strong>{data!.chartData![0].data}</strong>/{total}
            </div>
          )}
          {showNumber && (
            <div>
              <strong>{data!.chartData![0].data}</strong>
            </div>
          )}
        </div>

        <svg className={this._classNames.chart}>
          <g>{bars[0]}</g>
          {isCalloutVisible ? (
            <div>
              <Callout
                gapSpace={0}
                target={this.state.refSelected}
                setInitialFocus={true}
                directionalHint={DirectionalHint.topRightEdge}
              >
                <div className={this._classNames.hoverCardRoot}>
                  <div className={this._classNames.hoverCardTextStyles}>{this.state.legendSelected}</div>
                  <div className={this._classNames.hoverCardDataStyles}>{this.state.dataForHoverCard}</div>
                </div>
              </Callout>
            </div>
          ) : null}
        </svg>
        {showLegend && <div className={this._classNames.legendContainer}>{bars[1]}</div>}
      </div>
    );
  }

  private _adjustProps(): void {
    const { theme, className, styles, width, barHeight, isMultiStackedBarChart } = this.props;
    this._classNames = getClassNames(styles!, {
      legendColor: this.state.color,
      theme: theme!,
      width: width!,
      barHeight: barHeight!,
      className
    });
  }

  private _createBarsAndLegends(data: IChartProps, barHeight: number, palette: IPalette): [JSX.Element[], JSX.Element] {
    const defaultPalette: string[] = [palette.blueLight, palette.blue, palette.blueMid, palette.red, palette.black];
    const legendDataItems: ILegend[] = [];
    // calculating starting point of each bar and it's range
    const startingPoint: number[] = [];
    const total = data.chartData!.reduce(
      (acc: number, point: IChartDataPoint) => acc + (point.data ? point.data : 0),
      0
    );
    let prevPosition = 0;
    let value = 0;
    const bars = data.chartData!.map((point: IChartDataPoint, index: number) => {
      const color: string = point.color ? point.color : defaultPalette[Math.floor(Math.random() * 4 + 1)];
      const pointData = point.data ? point.data : 0;
      // mapping data to the format Legends component needs
      const legend: ILegend = {
        title: point.legend!,
        color: color,
        action: () => {
          this._onHover(point.legend!, pointData, color);
        },
        hoverAction: () => {
          this._onHover(point.legend!, pointData, color);
        },
        onMouseOutAction: () => {
          this._onLeave();
        }
      };
      legendDataItems.push(legend);
      if (index > 0) {
        prevPosition += value;
      }
      value = (pointData / total) * 100;
      startingPoint.push(prevPosition);
      const isSelected = this.state.legendSelected === point.legend!;
      const styles = this.props.styles;
      this._classNames = getClassNames(styles!, {
        isSelected: isSelected,
        isChartSelected: this.state.isCalloutVisible
      });
      return (
        <g
          key={index}
          className={this._classNames.opacityChangeOnHover}
          ref={(e: SVGGElement) => {
            this._refCallback(e, legend.title);
          }}
          onMouseOver={this._onHover.bind(this, point.legend!, pointData, color)}
          onMouseLeave={this._onLeave}
        >
          <rect key={index} x={startingPoint[index] + '%'} y={0} width={value + '%'} height={barHeight} fill={color} />
        </g>
      );
    });
    const legends = <Legends legends={legendDataItems} />;
    return [bars, legends];
  }

  private _refCallback(element: SVGGElement, legendTitle: string): void {
    this.state.refArray.push({ legendText: legendTitle, refElement: element });
  }

  private _onHover(customMessage: string, pointData: number, color: string): void {
    if (!this.state.isCalloutVisible || this.state.legendSelected !== customMessage) {
      const refArray = this.state.refArray;
      const currentHoveredElement = refArray.find(
        (currentElement: IRefArrayData) => currentElement.legendText === customMessage
      );
      this.setState({
        isCalloutVisible: true,
        refSelected: currentHoveredElement!.refElement,
        legendSelected: customMessage,
        dataForHoverCard: pointData,
        color: color
      });
    }
  }

  private _onLeave(): void {
    if (this.state.isCalloutVisible) {
      this.setState({
        isCalloutVisible: false,
        refSelected: null,
        legendSelected: '',
        dataForHoverCard: 0,
        color: ''
      });
    }
  }
}
