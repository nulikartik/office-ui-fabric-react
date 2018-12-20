import * as React from 'react';
import { createDragApiRef, Layout } from 'react-grid-layout';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import {
  IDashboardGridLayoutWithAddCardPanelProps,
  IDashboardGridLayoutWithAddCardPanelState
} from './DashboardGridLayoutWithAddCardPanel.types';
import { DraggingCard } from './DraggingCard/DraggingCard';
import {
  AddCardPanel,
  DashboardGridSectionLayout,
  IDGLCard,
  IDashboardCardLayout,
  ISection,
  CardSize,
  DashboardGridBreakpointLayouts,
  DraggingAnimationType
} from '../../../index';
import { getCardStyles, getClassNames } from './DashboardGridLayoutWithAddCardPanel.styles';

export const dragApi = createDragApiRef();
export class DashboardGridLayoutWithAddCardPanel extends BaseComponent<
  IDashboardGridLayoutWithAddCardPanelProps,
  IDashboardGridLayoutWithAddCardPanelState
> {
  private _cardsForLayout: IDGLCard[] = [];
  private _cardsForAddCardPanel: IDGLCard[] = [];

  constructor(props: IDashboardGridLayoutWithAddCardPanelProps) {
    super(props);
    this.state = {
      cardsForAddCardPanel: [],
      dashboardCards: [],
      sections: [],
      layout: {
        lg: [{ i: 'section0', y: 0, x: 0, size: CardSize.section }]
      },
      renderDraggingCard: false,
      selectedCardId: '',
      selectedCardInitialX: 0,
      selectedCardSize: CardSize.small,
      selectedCardTitle: ''
    };
  }

  public componentDidUpdate(): void {
    if (this._cardsForAddCardPanel !== this.props.addCardPanelCards || this._cardsForLayout !== this.props.dashboardCards) {
      this._cardsForAddCardPanel = this.props.addCardPanelCards;
      this._cardsForLayout = this.props.dashboardCards;
      const cardIds: string[] = [];
      const layout: DashboardGridBreakpointLayouts = this.state.layout;
      this.props.dashboardCards.map((card: IDGLCard) => {
        cardIds.push(card.id);
        const cardLayout: IDashboardCardLayout = { i: card.id, x: card.x, y: card.y, size: card.cardSize };
        layout.lg!.push(cardLayout);
      });
      this.props.addCardPanelCards.map((card: IDGLCard) => {
        cardIds.push(card.id);
      });
      const sectionsInfo: ISection = {
        id: 'section0',
        title: this.props.sectionTitle
      };
      sectionsInfo.cardIds = cardIds;
      this.setState({
        cardsForAddCardPanel: this._cardsForAddCardPanel,
        dashboardCards: this._cardsForLayout,
        sections: [sectionsInfo],
        layout: layout
      });
    }
  }

  public render(): JSX.Element {
    const { isOpen, isDraggable, panelHeader } = this.props;
    return (
      <>
        {this.state.renderDraggingCard && (
          <DraggingCard
            setDragMode={this._hideDraggingCard}
            cardId={this.state.selectedCardId}
            cardSize={this.state.selectedCardSize}
            initialX={this.state.selectedCardInitialX}
            title={this.state.selectedCardTitle}
            draggingAnimation={this.state.draggingAnimation}
          />
        )}
        <AddCardPanel
          header={panelHeader}
          isOpen={isOpen}
          cards={this.state.cardsForAddCardPanel}
          moveCardFromAddCardPanelToDashboard={this._addCard}
          onDismiss={this._onPanelDismiss}
          draggingCardCallback={this._draggingCardCallback}
          initialX={this.state.selectedCardInitialX}
        />
        <div className="dashboardContainerClassName">
          <DashboardGridSectionLayout
            isDraggable={isDraggable}
            layout={this.state.layout}
            sections={this.state.sections}
            cards={this.state.dashboardCards}
            dragApi={dragApi}
            onLayoutChange={this._onLayoutChange}
          />
        </div>
      </>
    );
  }

  private _draggingCardCallback = (
    cardId: string,
    title: string,
    cardSize: CardSize,
    initialX: number,
    draggingAnimation?: DraggingAnimationType
  ) => {
    this.setState({
      renderDraggingCard: true,
      selectedCardId: cardId,
      selectedCardInitialX: initialX,
      selectedCardSize: cardSize,
      selectedCardTitle: title,
      draggingAnimation
    });
  };

  private _hideDraggingCard = () => {
    this.setState({
      renderDraggingCard: false
    });
  };

  private _onPanelDismiss = () => {
    if (this.props.onPanelDismiss) {
      this.props.onPanelDismiss();
    }
  };

  private _onLayoutChange = (currentLayout: Layout[]): void => {
    const index = currentLayout.length - 1;
    // checking if a dragging card action is performed.
    // If dragging is performed, dragging card is added to the layout whose id starts with 'n'
    if (index > -1 && currentLayout[index].i!.startsWith('n')) {
      const newlyAddedCardId = currentLayout[index].i!.substring(1);
      const newlyAddedCard = currentLayout[index];
      const addCardPanelCards = this.state.cardsForAddCardPanel;
      let cardIndex: number = -1;
      let newLayout: DashboardGridBreakpointLayouts = { lg: [] };
      // find the card selected in the list of cards in add card panel
      addCardPanelCards.map((card: IDGLCard, index: number) => {
        if (card.id === newlyAddedCardId) {
          cardIndex = index;
          const cardLayout: IDashboardCardLayout = { i: card.id, x: newlyAddedCard.x, y: newlyAddedCard.y, size: card.cardSize };
          newLayout.lg!.push(cardLayout);
        }
      });
      newLayout.lg = newLayout.lg!.concat(this.state.layout.lg!);
      if (cardIndex !== -1) {
        // remove the selected card from the add card panel and add it to the list of cards that are to be show in layout
        const cardSelected = addCardPanelCards.splice(cardIndex, 1);
        let newLayoutCards: IDGLCard[] = [];
        newLayoutCards.push(cardSelected[0]);
        newLayoutCards = newLayoutCards.concat(this.state.dashboardCards);
        this.setState({
          cardsForAddCardPanel: addCardPanelCards,
          dashboardCards: newLayoutCards,
          layout: newLayout
        });
      }
    }
    // logic to add card to the dashboard when '+' sign is clicked
    else {
      const newLayout: DashboardGridBreakpointLayouts = { lg: [] };
      currentLayout.map((individualItemLayout: Layout) => {
        const key: string = individualItemLayout.w.toString() + individualItemLayout.h.toString();
        let cardSize = CardSize.small;
        // recreating layout based off width and height of card. The width and height values are returned by RGl
        // medium wide is 2 scale wide and 1 scale in height
        // large is 2 scale high and wide
        // mediumTall is 1 scale wide and 2 scales high
        if (individualItemLayout.h === 1) {
          cardSize = CardSize.section;
        } else if (key === '28') {
          cardSize = CardSize.large;
        } else if (key === '18') {
          cardSize = CardSize.mediumTall;
        } else if (key === '24') {
          cardSize = CardSize.mediumWide;
        }
        const itemLayout: IDashboardCardLayout = {
          i: individualItemLayout.i!,
          x: individualItemLayout.x,
          y: individualItemLayout.y,
          size: cardSize
        };
        newLayout.lg!.push(itemLayout);
      });
      if (newLayout !== this.state.layout) {
        if (this.props.onLayoutChange) {
          this.props.onLayoutChange(newLayout);
        }
        this.setState({
          layout: newLayout
        });
      }
    }
  };

  private _addCard = (cardId: string): void => {
    const addCardPanelCards = this.state.cardsForAddCardPanel;
    let cardIndex: number = -1;
    const layout: DashboardGridBreakpointLayouts = this.state.layout;
    // find the card selected in the list of cards in add card panel
    addCardPanelCards.map((card: IDGLCard, index: number) => {
      if (card.id === cardId) {
        cardIndex = index;
        // calculate new layout for the selected card from add card panel
        const calculatedLayout: { x: number; y: number } = this._calculateNextCardPostion(card.cardSize);
        const cardLayout: IDashboardCardLayout = { i: card.id, x: calculatedLayout.x, y: calculatedLayout.y, size: card.cardSize };
        layout.lg!.push(cardLayout);
      }
    });
    if (cardIndex !== -1) {
      // remove the selected card from the add card panel and add it to the list of cards that are to be show in layout
      const cardSelected = addCardPanelCards.splice(cardIndex, 1);
      const layoutCards: IDGLCard[] = this.state.dashboardCards;
      layoutCards.push(cardSelected[0]);
      this.setState({
        cardsForAddCardPanel: addCardPanelCards,
        dashboardCards: layoutCards,
        layout: layout
      });
      // scroll to the card that was added to the layout
      this._async.setTimeout(() => {
        if (document.getElementById(cardId + 'dglCard')) {
          document.getElementById(cardId + 'dglCard')!.scrollIntoView({ behavior: 'smooth' });
          const css = getClassNames(getCardStyles!);
          document.getElementById(cardId + 'dglCard')!.classList.add(css.fadeIn);
        }
      }, 100);
    }
  };

  // calculate the position for the selected card from add card panel
  // The logic below to figure out the position is a two step process
  // 1) Getting the last and last but one row's most right card
  // 2) Then check if adding a card to last row will exceed the row's width more than last but one row
  // If last row's width becomes greater then add the card to the next row(y) at position 0(x: 0) else add to the exisiting row at the end
  private _calculateNextCardPostion = (cardSize: CardSize) => {
    let newCardXPosition: number = 0;
    let newCardYPosition: number = 0;
    let lastRowFinalCardPosition: number = 0;
    let lastButOneRowFinalCardPosition: number = 0;
    const layoutState = this.state.layout;
    const lastElement: undefined | IDashboardCardLayout = layoutState.lg![layoutState.lg!.length - 1];
    const lastButOneElement = layoutState.lg![layoutState.lg!.length - 2];
    if (lastElement) {
      if (lastButOneElement) {
        if (lastElement.y === lastButOneElement.y) {
          // last two cards on same level
          newCardXPosition = 0;
          newCardYPosition = lastElement.y + 1;
          return { x: newCardXPosition, y: newCardYPosition };
        } else {
          // not on same level
          if (lastElement.size === CardSize.mediumWide || lastElement.size === CardSize.large) {
            lastRowFinalCardPosition = lastElement.x + 2;
          } else {
            lastRowFinalCardPosition = lastElement.x + 1;
          }
          if (lastButOneElement.size === CardSize.mediumWide || lastButOneElement.size === CardSize.large) {
            lastButOneRowFinalCardPosition = lastButOneElement.x + 2;
          } else {
            lastButOneRowFinalCardPosition = lastButOneElement.x + 1;
          }
        }
        if (cardSize === CardSize.mediumWide || cardSize === CardSize.large) {
          lastRowFinalCardPosition += 2;
        } else {
          lastRowFinalCardPosition += 1;
        }
        if (lastRowFinalCardPosition <= lastButOneRowFinalCardPosition) {
          newCardXPosition = lastElement.x + 1;
          newCardYPosition = lastElement.y;
        } else {
          newCardYPosition = lastElement.y + 1;
        }
        return { x: newCardXPosition, y: newCardYPosition };
      } else {
        // last element exists but not lastButOne
        return { x: 0, y: lastElement.y + 1 };
      }
    }
    // if initially no cards in dashbaord return x: 0, y: 0 by default
    return { x: 0, y: 0 };
  };
}
