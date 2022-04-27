import { Box } from "grommet";
import _ from "lodash";
import React, { useContext, useEffect, useRef } from "react";
import Excalidraw from "@excalidraw/excalidraw";

import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DrawingCardState, PlayerViewPermission } from "../../state/CardState";
import { BaseCard } from "./base/BaseCard";
import { ViewTypeContext, ViewType } from "../ViewTypeContext";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState as ExcalidrawState,
  ExcalidrawAPIRefValue,
} from "@excalidraw/excalidraw/types/types";
import { ActiveDashboardOf } from "../../state/AppState";

type Size = { height: number; width: number };

export function DrawingCard(props: {
  card: DrawingCardState;
  outerSize: Size;
}) {
  const { state, dispatch } = React.useContext(ReducerContext);

  const viewType = useContext(ViewTypeContext);
  const excalidrawRef = useRef<ExcalidrawAPIRefValue>(null);
  const excalidrawStateRef: React.MutableRefObject<Partial<ExcalidrawState>> =
    useRef({});

  const dashboard = ActiveDashboardOf(state);
  const allLayouts = Object.values(dashboard?.layoutsBySize || {}).flat();
  const layoutsForThisCard = allLayouts.filter(
    (l) => l.i === props.card.cardId
  );

  useEffect(() => {
    if (!excalidrawRef.current?.ready) {
      return;
    }
    excalidrawRef.current.refresh();
  }, [layoutsForThisCard]);

  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  return (
    <BaseCard cardState={props.card} commands={[]}>
      <Box fill tabIndex={0}>
        <Excalidraw
          ref={excalidrawRef}
          viewModeEnabled={!canEdit}
          initialData={{ elements: props.card.sceneElements }}
          onChange={(elements, appState) => {
            if (!excalidrawRef.current?.ready) {
              return;
            }

            const newExcalidrawState = {
              editingElement: appState.editingElement,
              draggingElement: appState.draggingElement,
              resizingElement: appState.resizingElement,
            };

            if (!_.isEqual(excalidrawStateRef.current, newExcalidrawState)) {
              console.log("excalidraw onChange: excalidrawState changed");
              excalidrawStateRef.current = newExcalidrawState;
              dispatch(
                CardActions.SetSceneElements({
                  cardId: props.card.cardId,
                  sceneElements: _.cloneDeep(elements) as ExcalidrawElement[],
                })
              );
            }
          }}
        />
      </Box>
    </BaseCard>
  );
}
