import React from "react";
import { Box, Header, Button } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";

export function BaseCard(props: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box fill elevation="medium">
      <Box>
        <Header pad="xsmall" background="brand">
          <Button
            className="drag-handle"
            icon={<FontAwesomeIcon icon={faGripLines} />}
          />
          {props.header}
        </Header>
      </Box>
      <Box flex={{ grow: 1 }} pad="xxsmall">
        {props.children}
      </Box>
    </Box>
  );
}
