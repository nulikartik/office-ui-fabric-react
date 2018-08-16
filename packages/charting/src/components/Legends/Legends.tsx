import * as React from 'react';

import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { HoverCard, IExpandingCardProps } from 'office-ui-fabric-react/lib/HoverCard';
import { classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { ResizeGroup } from 'office-ui-fabric-react/lib/ResizeGroup';
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import { OverflowSet, IOverflowSetItemProps } from 'office-ui-fabric-react/lib/OverflowSet';
import {
  ILegend,
  ILegendsProps,
  ILegendsStyles,
  ILegendStyleProps,
  ILegendOverflowData,
  ILegendItem
} from './Legends.types';
import { getStyles } from './Legends.styles';

const getClassNames = classNamesFunction<ILegendStyleProps, ILegendsStyles>();
let classNames = getClassNames(getStyles!, {});

export interface ILegendState {
  selectedLegend: string;
  selectedState: boolean;
  hoverState: boolean;
}
export class Legends extends React.Component<ILegendsProps, ILegendState> {
  public constructor(props: ILegendsProps) {
    super(props);
    this.state = {
      selectedLegend: 'none',
      selectedState: false,
      hoverState: false
    };
  }

  public render(): JSX.Element {
    const dataToRender = this._generateData();
    return (
      <div className={classNames.root}>
        <ResizeGroup
          data={dataToRender}
          onReduceData={this._onReduceData}
          onRenderData={this._onRenderData}
          onGrowData={this._onGrowData}
        />
      </div>
    );
  }

  private _generateData(): ILegendOverflowData {
    const dataItems: ILegend[] = [];
    this.props.legends.map((legend: ILegend, index: number) => {
      const legendItem: ILegendItem = {
        title: legend.title,
        action: legend.action,
        color: legend.color,
        key: index
      };
      dataItems.push(legendItem);
    });
    const result: ILegendOverflowData = {
      primary: dataItems,
      overflow: []
    };
    return result;
  }

  private _onRenderData = (data: IOverflowSetItemProps): JSX.Element => {
    return (
      <OverflowSet
        items={data.primary}
        overflowItems={data.overflow}
        onRenderItem={this._renderButton}
        onRenderOverflowButton={this._renderOverflowItems}
      />
    );
  };

  private _onReduceData = (currentdata: IOverflowSetItemProps): {} | void => {
    if (currentdata.primary.length === 0) {
      return;
    }
    const overflow = [...currentdata.primary.slice(-1), ...currentdata.overflow];
    const primary = currentdata.primary.slice(0, -1);
    return { primary, overflow };
  };

  private _onGrowData = (currentdata: IOverflowSetItemProps): {} | void => {
    if (currentdata.overflow.length === 0) {
      return;
    }
    const overflow = currentdata.overflow.slice(1);
    const primary = [...currentdata.primary, ...currentdata.overflow.slice(0, 1)];
    return { primary, overflow };
  };

  private _onClick = (legend: ILegend): void => {
    if (this.state.selectedState === true && this.state.selectedLegend === legend.title) {
      this.setState({ selectedLegend: 'none', selectedState: false });
    } else {
      this.setState({ selectedState: true, selectedLegend: legend.title });
    }
  };

  private _onRenderCompactCard = (expandingCard: IExpandingCardProps): JSX.Element => {
    const overflowHoverCardLegends: JSX.Element[] = [];
    expandingCard.renderData.forEach((legend: IOverflowSetItemProps, index: number) => {
      const hoverCardElement = this._renderButton(legend, index, true);
      overflowHoverCardLegends.push(hoverCardElement);
    });
    return <div>{overflowHoverCardLegends}</div>;
  };

  private _renderOverflowItems = (legends: ILegend[]) => {
    const items: IContextualMenuItem[] = [];
    legends.forEach((legend: ILegend, i: number) => {
      items.push({ key: i.toString(), name: legend.title, onClick: legend.action });
    });
    const renderOverflowData: IExpandingCardProps = { renderData: legends };
    const expandingCardProps: IExpandingCardProps = {
      onRenderCompactCard: this._onRenderCompactCard,
      renderData: renderOverflowData,
      mode: 0
    };
    return (
      <HoverCard expandingCardProps={expandingCardProps}>
        <div className={classNames.overflowIndicationTextStyle}>{items.length} more</div>
      </HoverCard>
    );
  };

  private _onHoverOverLegend = (legend: ILegend) => {
    if (!this.state.selectedState) {
      this.setState({ hoverState: true, selectedLegend: legend.title });
    }
  };

  private _onLeave = () => {
    if (!this.state.selectedState) {
      this.setState({ hoverState: false, selectedLegend: 'none' });
    }
  };

  private _renderButton = (data: IOverflowSetItemProps, index?: number, overflow?: boolean) => {
    const legend: ILegend = { title: data.title, color: data.color, action: data.action };
    const color = this._getColor(legend.title, legend.color);
    classNames = getClassNames(getStyles!, {
      colorOnSelectedState: color,
      borderColor: legend.color,
      overflow: overflow
    });
    const onClickHandler = () => {
      this._onClick(legend);
    };
    const onHoverHandler = () => {
      this._onHoverOverLegend(legend);
    };
    return (
      <div
        key={index}
        className={classNames.legend}
        onClick={onClickHandler}
        onMouseOver={onHoverHandler}
        onMouseOut={this._onLeave}
      >
        <div className={classNames.rect} />
        <div className={classNames.text}>{legend.title}</div>
      </div>
    );
  };

  private _getColor(title: string, color: string): string {
    let legendColor = color;
    if (this.state.hoverState && this.state.selectedLegend === title) {
      legendColor = color;
    } else if (this.state.selectedLegend === 'none' || this.state.selectedLegend === title) {
      legendColor = color;
    } else {
      legendColor = DefaultPalette.white;
    }
    return legendColor;
  }
}
