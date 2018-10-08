import * as React from 'react';
import { LineChart, ILineChartProps } from '../index';
import { IChartProps, ILineChartPoints } from '@uifabric/charting';
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

interface IRootStyles {
  height: string;
  width: string;
}

export class LineChartStyledExample extends React.Component<ILineChartProps, {}> {
  constructor(props: ILineChartProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <div>{this._styledExample()}</div>;
  }

  private _styledExample(): JSX.Element {
    const points: ILineChartPoints[] = [
      {
        data: [
          { x: new Date(2018, 9, 4, 10), y: 10 },
          { x: new Date(2018, 9, 4, 12), y: 18 },
          { x: new Date(2018, 9, 4, 14), y: 24 },
          { x: new Date(2018, 9, 4, 16), y: 35 },
          { x: new Date(2018, 9, 4, 18), y: 35 },
          { x: new Date(2018, 9, 4, 20), y: 38 }
        ],
        legend: 'Week',
        color: DefaultPalette.blue
      }
    ];

    const data: IChartProps = {
      chartTitle: 'Line Chart',
      lineChartData: points
    };
    const rootStyle: IRootStyles = { width: '700px', height: '300px' };

    const points1: ILineChartPoints[] = [
      {
        data: [
          { x: new Date(2018, 9, 4, 10), y: 10 },
          { x: new Date(2018, 9, 5, 12), y: 18 },
          { x: new Date(2018, 9, 6, 14), y: 24 },
          { x: new Date(2018, 9, 7, 16), y: 35 },
          { x: new Date(2018, 9, 8, 18), y: 35 },
          { x: new Date(2018, 9, 11, 0), y: 38 }
        ],
        legend: 'Week',
        color: DefaultPalette.blue
      }
    ];

    const data1: IChartProps = {
      chartTitle: 'Line Chart',
      lineChartData: points1
    };
    return (
      <div>
        <div className={mergeStyles(rootStyle)}>
          <LineChart data={data} strokeWidth={4} startDate={new Date(2018, 9, 4)} endDate={new Date(2018, 9, 5)} />
        </div>
        <div className={mergeStyles(rootStyle)}>
          <LineChart data={data1} strokeWidth={4} startDate={new Date(2018, 9, 4)} endDate={new Date(2018, 9, 15)} />
        </div>
      </div>
    );
  }
}
