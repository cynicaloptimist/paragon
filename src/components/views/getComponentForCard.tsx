import React from "react";
import { CardState } from "../../state/CardState";

const DrawingCard = React.lazy(() => import("../cards/DrawingCard"));
const ArticleCard = React.lazy(() => import("../cards/article/ArticleCard"));
const InfoCard = React.lazy(() => import("../cards/article/InfoCard"));
const ClockCard = React.lazy(() => import("../cards/clock/ClockCard"));
const RollTableCard = React.lazy(
  () => import("../cards/roll-table/RollTableCard")
);
const ImageCard = React.lazy(() => import("../cards/ImageCard"));
const DiceCard = React.lazy(() => import("../cards/dice/DiceCard"));
const PDFCard = React.lazy(() => import("../cards/PDFCard"));
const LedgerCard = React.lazy(() => import("../cards/LedgerCard"));
const FrameCard = React.lazy(() => import("../cards/FrameCard"));
const BaseCard = React.lazy(() => import("../cards/base/BaseCard"));

export type Size = { height: number; width: number };

export function getComponentForCard(card: CardState, outerSize: Size) {
  if (card.type === "article") {
    return <ArticleCard card={card} />;
  }
  if (card.type === "info") {
    return <InfoCard card={card} />;
  }
  if (card.type === "clock") {
    return <ClockCard card={card} />;
  }
  if (card.type === "roll-table-h") {
    return <RollTableCard card={card} />;
  }
  if (card.type === "image") {
    return <ImageCard card={card} />;
  }
  if (card.type === "dice") {
    return <DiceCard card={card} />;
  }
  if (card.type === "drawing") {
    return <DrawingCard card={card} outerSize={outerSize} />;
  }
  if (card.type === "pdf") {
    return <PDFCard card={card} outerSize={outerSize} />;
  }
  if (card.type === "ledger") {
    return <LedgerCard card={card} />;
  }
  if (card.type === "frame") {
    return <FrameCard card={card} />;
  }

  const unsupportedCard: any = card;
  return (
    <BaseCard cardState={unsupportedCard as CardState} commands={null}>
      Unsupported card type: {unsupportedCard.type}
    </BaseCard>
  );
}
