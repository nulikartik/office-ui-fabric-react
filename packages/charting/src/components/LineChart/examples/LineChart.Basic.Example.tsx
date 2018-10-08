import * as React from 'react';
import { LineChart, ILineChartProps, ILineChartDataPoint } from '../index';
import { IChartProps, ILineChartPoints } from '@uifabric/charting';
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

interface IRootStyles {
  height: string;
  width: string;
}

export class LineChartBasicExample extends React.Component<ILineChartProps, {}> {
  constructor(props: ILineChartProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <div>{this._basicExample()}</div>;
  }

  private _basicExample(): JSX.Element {
    const date = new Date('10/31/2018');
    console.log('date: ', date);
    const points: ILineChartPoints[] = [
      {
        data: [{ x: new Date(2018, 9, 4), y: 10 }, { x: new Date(2018, 10, 2), y: 18 }],
        legend: 'First',
        color: DefaultPalette.blue
      }
    ];
    const data: IChartProps = {
      chartTitle: 'Line Chart',
      lineChartData: points
    };
    const rootStyle: IRootStyles = { width: '700px', height: '300px' };
    return (
      <div className={mergeStyles(rootStyle)}>
        <LineChart data={data} startDate={new Date(2018, 9, 4)} endDate={new Date(2018, 10, 2)} />
      </div>
    );
  }
}
