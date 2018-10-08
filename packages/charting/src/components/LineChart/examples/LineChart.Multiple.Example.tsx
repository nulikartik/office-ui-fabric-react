import * as React from 'react';
import { LineChart, ILineChartProps, ILineChartDataPoint } from '../index';
import { IChartProps, ILineChartPoints } from '@uifabric/charting';
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

interface IRootStyles {
  height: string;
  width: string;
}

export class LineChartMultipleExample extends React.Component<ILineChartProps, {}> {
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
          { x: new Date(2010, 9, 4), y: 10 },
          { x: new Date(2011, 3, 4), y: 18 },
          { x: new Date(2011, 7, 4), y: 24 },
          { x: new Date(2012, 9, 4), y: 25 },
          { x: new Date(2013, 9, 4), y: 15 },
          { x: new Date(2014, 9, 4), y: 30 },
          { x: new Date(2015, 9, 4), y: 18 },
          { x: new Date(2016, 9, 4), y: 32 },
          { x: new Date(2017, 9, 4), y: 29 },
          { x: new Date(2017, 9, 4), y: 43 },
          { x: new Date(2018, 10, 2), y: 45 }
        ],
        legend: 'First',
        color: DefaultPalette.blue
      },
      {
        data: [
          { x: new Date(2010, 10, 10), y: 10 },
          { x: new Date(2013, 1, 7), y: 18 },
          { x: new Date(2013, 9, 4), y: 24 },
          { x: new Date(2014, 8, 5), y: 35 },
          { x: new Date(2015, 3, 3), y: 35 },
          { x: new Date(2016, 2, 2), y: 38 },
          { x: new Date(2016, 4, 4), y: 40 },
          { x: new Date(2017, 1, 1), y: 43 },
          { x: new Date(2018, 10, 2), y: 45 }
        ],
        legend: 'Second',
        color: DefaultPalette.red
      },
      {
        data: [
          { x: new Date(2010, 1, 1), y: 10 },
          { x: new Date(2013, 5, 7), y: 18 },
          { x: new Date(2016, 9, 4), y: 24 },
          { x: new Date(2017, 8, 5), y: 35 },
          { x: new Date(2018, 3, 3), y: 35 },
          { x: new Date(2020, 11, 11), y: 38 }
        ],
        legend: 'Third',
        color: DefaultPalette.green
      }
    ];

    const data: IChartProps = {
      chartTitle: 'Line Chart',
      lineChartData: points
    };
    const rootStyle: IRootStyles = { width: '700px', height: '300px' };
    return (
      <div className={mergeStyles(rootStyle)}>
        <LineChart data={data} strokeWidth={4} startDate={new Date(2010, 1, 1)} endDate={new Date(2017, 1, 1)} />
      </div>
    );
  }
}
