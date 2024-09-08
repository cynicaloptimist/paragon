import {
  faGripLines,
  faThumbtack,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Header, Heading, TextInput } from "grommet";
import React, { useContext } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { CardState } from "../../../state/CardState";
import { ViewType, ViewTypeContext } from "../../ViewTypeContext";
import { CardColorPickerButton } from "./CardColorPickerButton";
import { PlayerViewButton } from "./PlayerViewButton";
import { ComputeThemeProps } from "./ComputeThemeProps";
import { DashboardActions } from "../../../actions/DashboardActions";
import { useActiveDashboardId } from "../../hooks/useActiveDashboardId";
import { CardMenu } from "./CardMenu";
import { useIsCardPinned } from "../../hooks/useIsCardPinned";

export function CardHeader(props: {
  cardState: CardState;
  popToast: (toast: string) => void;
  showAllButtons: boolean;
}) {
  const { dispatch } = React.useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  const [isHeaderEditable, setHeaderEditable] = React.useState<boolean>(false);
  const [didSelectHeader, setDidSelectHeader] = React.useState<boolean>(false);
  const [headerInput, setHeaderInput] = React.useState<string>("");
  const saveAndClose = () => {
    if (headerInput.length > 0) {
      dispatch(
        CardActions.SetCardTitle({
          cardId: props.cardState.cardId,
          title: headerInput,
        })
      );
    }
    setHeaderEditable(false);
    setDidSelectHeader(false);
  };
  const viewType = useContext(ViewTypeContext);
  const isPinned = useIsCardPinned(props.cardState.cardId);

  const isGmView = viewType === ViewType.GameMaster;
  const isDashboardView = viewType === ViewType.Dashboard;

  const themeProps = ComputeThemeProps(props.cardState);

  const hideableButtonsStyle: React.CSSProperties = {
    display: isGmView && props.showAllButtons ? undefined : "none",
  };

  if (isPinned) {
    return (
      <>
        <Box height={{ height: "4px" }} background="brand" />
        <Box
          style={{
            position: "absolute",
            top: 5,
            right: 5,
          }}
        >
          <Button
            hoverIndicator
            icon={<FontAwesomeIcon icon={faThumbtack} />}
            tip="Unpin card"
            onClick={() => {
              if (dashboardId) {
                dispatch(
                  DashboardActions.SetCardPinned({
                    dashboardId,
                    cardId: props.cardState.cardId,
                    pinned: false,
                  })
                );
              }
            }}
          />
        </Box>
      </>
    );
  }

  return (
    <Header {...themeProps}>
      <Box fill direction="row" gap="xxsmall" align="center">
        <DragHandleButton />
        {isHeaderEditable ? (
          <TextInput
            ref={(el) => {
              if (el && !didSelectHeader) {
                el.select();
                setDidSelectHeader(true);
              }
            }}
            defaultValue={props.cardState.title}
            onChange={(changeEvent) => setHeaderInput(changeEvent.target.value)}
            onKeyDown={(keyEvent) => {
              if (keyEvent.key === "Enter") {
                saveAndClose();
              }
            }}
            onBlur={saveAndClose}
          />
        ) : (
          <Box
            fill
            direction="row"
            className="drag-handle"
            onDoubleClick={() =>
              (isGmView || isDashboardView) && setHeaderEditable(true)
            }
            align="center"
          >
            <Heading
              level={3}
              margin="none"
              truncate
              title={props.cardState.title}
            >
              {props.cardState.title}
            </Heading>
          </Box>
        )}

        <Box direction="row" flex="grow" style={hideableButtonsStyle}>
          <CardColorPickerButton card={props.cardState} />
          <PlayerViewButton
            cardState={props.cardState}
            popToast={props.popToast}
          />
        </Box>
        {isGmView && props.cardState.type !== "info" && (
          <CardMenu
            card={props.cardState}
            renameCard={() => setHeaderEditable(true)}
          />
        )}
        {(isGmView || isDashboardView) && (
          <Button
            icon={<FontAwesomeIcon icon={faTimes} />}
            onClick={() =>
              dashboardId &&
              dispatch(
                DashboardActions.CloseCard({
                  dashboardId,
                  cardId: props.cardState.cardId,
                })
              )
            }
          />
        )}
      </Box>
    </Header>
  );
}

function DragHandleButton() {
  const [isDragging, setDragging] = React.useState(false);

  return (
    <Button
      className="drag-handle"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      icon={<FontAwesomeIcon icon={faGripLines} />}
    />
  );
}
