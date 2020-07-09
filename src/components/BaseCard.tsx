import React from "react";
import { Box, Header, Button, TextInput, Heading, Footer } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardActions } from "../actions/Actions";
import { CardState } from "../state/CardState";

export function BaseCard(props: {
  commands: React.ReactNode;
  cardState: CardState;
  children: React.ReactNode;
}) {
  const { dispatch } = React.useContext(ReducerContext);

  const [isHeaderEditable, setHeaderEditable] = React.useState<boolean>(false);
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
  };

  return (
    <Box fill elevation="medium">
      <Header pad="xsmall" background="brand">
        <Box
          fill
          className="drag-handle"
          direction="row"
          align="baseline"
          gap="xxsmall"
        >
          <Button icon={<FontAwesomeIcon icon={faGripLines} />} />
          {isHeaderEditable ? (
            <TextInput
              placeholder={props.cardState.title}
              onChange={(changeEvent) =>
                setHeaderInput(changeEvent.target.value)
              }
              onKeyDown={(keyEvent) => {
                if (keyEvent.key === "Enter") {
                  saveAndClose();
                }
              }}
              autoFocus
              onBlur={saveAndClose}
            />
          ) : (
            <Box
              fill
              direction="row"
              onDoubleClick={() => setHeaderEditable(true)}
            >
              <Heading level={3} margin="none" truncate>
                {props.cardState.title}
              </Heading>
            </Box>
          )}
          <Button
            icon={<FontAwesomeIcon icon={faTimes} />}
            onClick={() =>
              dispatch(
                CardActions.CloseCard({ cardId: props.cardState.cardId })
              )
            }
          />
        </Box>
      </Header>
      <Box flex pad="xxsmall">
        {props.children}
      </Box>
      <Footer
        background="brand"
        justify="end"
        pad={{ right: "small" }}
        overflow={{ horizontal: "auto" }}
      >
        {props.commands}
      </Footer>
    </Box>
  );
}
