import { faGripLines, faTimes } from "@fortawesome/free-solid-svg-icons";
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

export function CardHeader(props: {
  cardState: CardState;
  popToast: (toast: string) => void;
}) {
  const { dispatch } = React.useContext(ReducerContext);
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

  return (
    <Header pad="xsmall" height="3.4rem" {...themeProps}>
      <Box
        fill
        className={isHeaderEditable ? "" : "drag-handle"}
        direction="row"
        gap="xxsmall"
        align="center"
      >
        <Button icon={<FontAwesomeIcon icon={faGripLines} />} />
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
        {isGmView && <CardColorPickerButton cardId={props.cardState.cardId} />}
        {isGmView && (
          <PlayerViewButton
            cardState={props.cardState}
            popToast={props.popToast}
          />
        )}
        {(isGmView || isDashboardView) && (
          <Button
            icon={<FontAwesomeIcon icon={faTimes} />}
            onClick={() =>
              dispatch(
                CardActions.CloseCard({ cardId: props.cardState.cardId })
              )
            }
          />
        )}
      </Box>
    </Header>
  );
}
