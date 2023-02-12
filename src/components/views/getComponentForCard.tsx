import React from "react";
import { CardState } from "../../state/CardState";
import { ArticleCard } from "../cards/article/ArticleCard";
import { ClockCard } from "../cards/clock/ClockCard";
import { DiceCard } from "../cards/dice/DiceCard";
import { ImageCard } from "../cards/ImageCard";
import { PDFCard } from "../cards/PDFCard";
import { RollTableCard } from "../cards/roll-table/RollTableCard";
import { LedgerCard } from "../cards/LedgerCard";
import BaseCard from "../cards/base/BaseCard";
import { InfoCard } from "../cards/article/InfoCard";
import { FrameCard } from "../cards/FrameCard";

const DrawingCard = React.lazy(() => import("../cards/DrawingCard"));

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
