import { TextArea } from "grommet";
import React from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { CardsState } from "../../../state/AppState";
import { ArticleCardState } from "../../../state/CardState";
import { MarkdownEditor } from "./MarkdownEditor";
import { useThrottledTrailing } from "../../hooks/useThrottled";

export function ArticleEditor(props: {
  card: ArticleCardState;
  isMarkdownEditorActive: boolean;
}) {
  const { state, dispatch } = React.useContext(ReducerContext);

  const saveCardContent = React.useCallback(
    (currentContent) => {
      const updatedContent = ConvertDoubleBracketsToWikiLinks(
        currentContent,
        state.cardsById
      );
      dispatch(
        CardActions.SetCardContent({
          cardId: props.card.cardId,
          content: updatedContent,
        })
      );
    },
    [props.card.cardId, state.cardsById, dispatch]
  );

  const saveCardContentThrottled = useThrottledTrailing(saveCardContent, 200);

  if (props.isMarkdownEditorActive) {
    return (
      <TextArea
        fill
        autoFocus
        defaultValue={props.card.content}
        onChange={(changeEvent) => {
          changeEvent.persist();
          saveCardContentThrottled(changeEvent.target.value);
        }}
        style={{ fontFamily: '"Roboto Mono", monospace' }}
      />
    );
  } else {
    return (
      <MarkdownEditor
        card={props.card}
        setContent={(newContent) => {
          saveCardContentThrottled(newContent);
        }}
      />
    );
  }
}
function ConvertDoubleBracketsToWikiLinks(
  markdownString: string,
  cards: CardsState
): string {
  return markdownString.replace(/\[\[([\w\d ]+)\]\]/g, (match, inner) => {
    const matchedCard = Object.values(cards).find(
      (card) => card.title.localeCompare(inner) === 0
    );
    if (!matchedCard) {
      return match;
    }
    return "[" + inner + "](" + matchedCard.cardId + ")";
  });
}
