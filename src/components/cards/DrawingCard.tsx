import { Box } from "grommet";
import _ from "lodash";
import React, { useContext, useEffect, useRef } from "react";
import Excalidraw from "@excalidraw/excalidraw";

import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DrawingCardState, PlayerViewPermission } from "../../state/CardState";
import { BaseCard } from "./base/BaseCard";
import { ViewTypeContext, ViewType } from "../ViewTypeContext";
import {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/types/element/types";
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

  const sceneElements = props.card.sceneElementJSONs
    ?.map((json) => {
      try {
        return JSON.parse(json);
      } catch (err) {
        console.log("Error parsing JSON: ", err);
        return null;
      }
    })
    .filter((element) => element !== null);

  useEffect(() => {
    if (!excalidrawRef.current?.ready) {
      return;
    }
    excalidrawRef.current.refresh();
  }, [layoutsForThisCard]);

  useEffect(() => {
    if (!excalidrawRef.current?.ready) {
      return;
    }
    const excalidrawState = excalidrawRef.current.getAppState();
    if (
      excalidrawState.editingElement ||
      excalidrawState.resizingElement ||
      excalidrawState.draggingElement
    ) {
      return;
    }
    excalidrawRef.current.updateScene({ elements: sceneElements });
  }, [sceneElements]);

  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  return (
    <BaseCard cardState={props.card} commands={[]}>
      <Box fill tabIndex={0}>
        <Excalidraw
          ref={excalidrawRef}
          viewModeEnabled={!canEdit}
          initialData={{ elements: sceneElements }}
          onChange={(
            elements: readonly ExcalidrawElement[],
            appState: ExcalidrawState
          ) => {
            if (!excalidrawRef.current?.ready) {
              return;
            }

            const newExcalidrawState: Partial<ExcalidrawState> = {
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
                  sceneElementJSONs: elements.map((e) => JSON.stringify(e)),
                })
              );
            }
          }}
        />
      </Box>
    </BaseCard>
  );
}
