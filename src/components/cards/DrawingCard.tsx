import { Box } from "grommet";
import _ from "lodash";
import React, { useContext, useEffect, useRef } from "react";
import { Excalidraw, restoreElements } from "@excalidraw/excalidraw";

import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DrawingCardState, PlayerViewPermission } from "../../state/CardState";
import BaseCard from "./base/BaseCard";
import { ViewTypeContext, ViewType } from "../ViewTypeContext";
import {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/types/element/types";
import {
  AppState as ExcalidrawState,
  BinaryFiles,
  ExcalidrawAPIRefValue,
} from "@excalidraw/excalidraw/types/types";
import { GetDashboard } from "../../state/AppState";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { FirebaseUtils } from "../../FirebaseUtils";
import { useUserId } from "../hooks/useAccountSync";
import { useUserIdFromActiveDashboard } from "../views/useUserIdFromActiveDashboard";

type Size = { height: number; width: number };
type ExcalidrawStateMemo = {
  draggingElement: NonDeletedExcalidrawElement | null;
  resizingElement: NonDeletedExcalidrawElement | null;
  selectionElement: NonDeletedExcalidrawElement | null;
  editingElement: NonDeletedExcalidrawElement | null;
  nonDeletedElementCount: number;
  fileCount: number;
};

export default function DrawingCard(props: {
  card: DrawingCardState;
  outerSize: Size;
}) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  const userId = useUserId();
  const viewType = useContext(ViewTypeContext);
  const excalidrawRef = useRef<ExcalidrawAPIRefValue>(null);
  const lastExcalidrawState: React.MutableRefObject<
    ExcalidrawStateMemo | undefined
  > = useRef();
  useCardDrawingFiles(excalidrawRef.current, props.card.cardId);

  const dashboard = GetDashboard(state, dashboardId);
  const allLayouts = Object.values(dashboard?.layoutsBySize || {}).flat();
  const layoutsForThisCard = allLayouts.filter(
    (l) => l.i === props.card.cardId
  );

  const sceneElements = getSceneElements(props.card);

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

    const elements = restoreElements(
      sceneElements,
      excalidrawRef.current.getSceneElements()
    );
    excalidrawRef.current.updateScene({ elements });
  }, [sceneElements]);

  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  const defaultTool = sceneElements.length === 0 ? "freedraw" : "selection";

  return (
    <BaseCard cardState={props.card} commands={[]}>
      <Box fill tabIndex={0}>
        <Excalidraw
          ref={excalidrawRef}
          viewModeEnabled={!canEdit}
          initialData={{
            elements: sceneElements,
            appState: {
              elementType: defaultTool,
            },
          }}
          onChange={(
            allElements: readonly ExcalidrawElement[],
            appState: ExcalidrawState,
            files: BinaryFiles
          ) => {
            if (!excalidrawRef.current?.ready) {
              return;
            }

            const newExcalidrawState: ExcalidrawStateMemo = {
              editingElement: appState.editingElement,
              draggingElement: appState.draggingElement,
              resizingElement: appState.resizingElement,
              selectionElement: appState.selectionElement,
              nonDeletedElementCount: allElements.filter((e) => e.isDeleted)
                .length,
              fileCount: Object.keys(files).length,
            };

            if (!_.isEqual(lastExcalidrawState.current, newExcalidrawState)) {
              console.log("excalidraw onChange: excalidrawState changed");
              lastExcalidrawState.current = newExcalidrawState;
              dispatch(
                CardActions.SetSceneElements({
                  cardId: props.card.cardId,
                  sceneElementJSONs: allElements.map((e) => JSON.stringify(e)),
                })
              );
              if (userId) {
                FirebaseUtils.SetCardFiles(userId, props.card.cardId, files);
              }
            }
          }}
        />
      </Box>
    </BaseCard>
  );
}

function getSceneElements(card: DrawingCardState): ExcalidrawElement[] {
  if (!card.sceneElementJSONs) {
    return [];
  }

  return card.sceneElementJSONs
    .map((json) => {
      try {
        return JSON.parse(json);
      } catch (err) {
        console.log("Error parsing JSON: ", err);
        return null;
      }
    })
    .filter((element) => element !== null);
}

function useCardDrawingFiles(
  excalidrawRef: ExcalidrawAPIRefValue | null,
  cardId: string
) {
  const userId = useUserIdFromActiveDashboard();
  useEffect(() => {
    if (!userId) {
      return;
    }

    const getFiles = async () => {
      const filesData = await FirebaseUtils.GetCardFiles(userId, cardId);
      if (excalidrawRef?.ready) {
        excalidrawRef.addFiles(Object.values(filesData));
      }
    };

    getFiles();
  }, [userId, cardId, excalidrawRef]);
}
