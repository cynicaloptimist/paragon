import * as React from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { ClockCardState } from "../../../state/CardState";

export function useOnClickSegment(props: { card: ClockCardState; }) {
    const { dispatch } = React.useContext(ReducerContext);

    const segmentClickHandler = React.useCallback(
        (clickedIndex: number) => {
            let value = clickedIndex + 1;
            if (props.card.displayType === "radial" &&
                props.card.value === 1 &&
                value === 1) {
                value = 0;
            }

            dispatch(
                CardActions.SetClockValue({
                    cardId: props.card.cardId,
                    value,
                })
            );
        },
        [props.card.cardId, props.card.value, props.card.displayType, dispatch]
    );
    return segmentClickHandler;
}
