import React from "react";
import { Box, Header, Button, TextInput, Heading } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";
import { ReducerContext } from "./ReducerContext";
import { Actions } from "./Actions";

export function BaseCard(props: {
  commands: React.ReactNode;
  cardId: string;
  children: React.ReactNode;
}) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const cardState = state.cardsById[props.cardId];

  const [isHeaderEditable, setHeaderEditable] = React.useState<boolean>(false);

  return (
    <Box fill elevation="medium">
      <Box>
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
                placeholder={cardState.title}
                onChange={(changeEvent) =>
                  dispatch(
                    Actions.SetCardTitle({
                      cardId: cardState.cardId,
                      title: changeEvent.target.value,
                    })
                  )
                }
                onKeyDown={(keyEvent) => {
                  if (keyEvent.key === "Enter") {
                    setHeaderEditable(false);
                  }
                }}
                autoFocus
                onBlur={() => setHeaderEditable(false)}
              />
            ) : (
              <Heading
                level={3}
                margin="none"
                style={{ flexGrow: 1 }}
                onDoubleClick={() => setHeaderEditable(true)}
                truncate
              >
                {cardState.title}
              </Heading>
            )}
          </Box>
          {props.commands}
        </Header>
      </Box>
      <Box flex={{ grow: 1 }} pad="xxsmall">
        {props.children}
      </Box>
    </Box>
  );
}
