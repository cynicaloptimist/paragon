import {
  faEllipsisV,
  faGripLines,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Header, Heading, Menu, TextInput } from "grommet";
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
import { randomString } from "../../../randomString";

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
  const isGmView = viewType === ViewType.GameMaster;
  const isDashboardView = viewType === ViewType.Dashboard;

  const themeProps = ComputeThemeProps(props.cardState);

  const hideableButtonsStyle: React.CSSProperties = {
    visibility: isGmView && props.showAllButtons ? "visible" : "hidden",
  };

  return (
    <Header {...themeProps}>
      <Box
        fill
        className={isHeaderEditable ? "" : "drag-handle"}
        direction="row"
        gap="xxsmall"
        align="center"
      >
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
            onDoubleClick={() =>
              (isGmView || isDashboardView) && setHeaderEditable(true)
            }
            align="center"
          >
            <Heading level={3} margin="none" truncate>
              {props.cardState.title}
            </Heading>
          </Box>
        )}

        <Box direction="row" flex="grow" style={hideableButtonsStyle}>
          <CardColorPickerButton cardId={props.cardState.cardId} />
          <PlayerViewButton
            cardState={props.cardState}
            popToast={props.popToast}
          />
        </Box>
        {isGmView && <CardMenu cardId={props.cardState.cardId} />}
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

function CardMenu(props: { cardId: string }) {
  const { dispatch } = React.useContext(ReducerContext);

  return (
    <Menu
      dropAlign={{ right: "right", top: "bottom" }}
      icon={<FontAwesomeIcon icon={faEllipsisV} />}
      items={[
        {
          label: "Create a Template from this Card",
          onClick: () => {
            const templateId = randomString();
            return dispatch(
              CardActions.CreateTemplateFromCard({
                cardId: props.cardId,
                templateId: templateId,
              })
            );
          },
        },
      ]}
    />
  );
}

function DragHandleButton() {
  const [isDragging, setDragging] = React.useState(false);

  return (
    <Button
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      icon={<FontAwesomeIcon icon={faGripLines} />}
    />
  );
}
