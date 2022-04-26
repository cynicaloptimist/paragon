import { Box } from "grommet";
import _ from "lodash";
import React, { useContext } from "react";
import Excalidraw from "@excalidraw/excalidraw";

import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DrawingCardState, PlayerViewPermission } from "../../state/CardState";
import { BaseCard } from "./base/BaseCard";
import { ViewTypeContext, ViewType } from "../ViewTypeContext";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

type Size = { height: number; width: number };

export function DrawingCard(props: {
  card: DrawingCardState;
  outerSize: Size;
}) {
  const { dispatch } = React.useContext(ReducerContext);

  const viewType = useContext(ViewTypeContext);

  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  return (
    <BaseCard cardState={props.card} commands={[]}>
      <Box fill tabIndex={0}>
        <Excalidraw
          viewModeEnabled={!canEdit}
          initialData={{ elements: props.card.sceneElements }}
          onChange={(elements) => {
            if (!_.isEqual(elements, props.card.sceneElements)) {
              dispatch(
                CardActions.SetSceneElements({
                  cardId: props.card.cardId,
                  sceneElements: elements as ExcalidrawElement[],
                })
              );
            }
          }}
        />
      </Box>
    </BaseCard>
  );
}
