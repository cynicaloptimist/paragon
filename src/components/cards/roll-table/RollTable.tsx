import { Box } from "grommet";
import React, { useEffect, useRef } from "react";
import { RollTableModel } from "./GetRollTableModel";

export function RollTable(props: { rollTableModel: RollTableModel }) {
  const rolledElement = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!rolledElement.current) {
      return;
    }
    const scrollTop = rolledElement.current.scrollTop;
    rolledElement.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Workaround for chromium bug https://bugs.chromium.org/p/chromium/issues/detail?id=833617
    setTimeout(() => {
      if (rolledElement.current?.scrollTop === scrollTop) {
        rolledElement.current.scrollIntoView({ block: "center" });
      }
    }, 500);
  }, [rolledElement, props.rollTableModel.rollResult]);

  return (
    <Box>
      <Box
        direction="row"
        flex="grow"
        pad={{ vertical: "xsmall" }}
        style={{ fontWeight: "bold", borderBottom: "1px solid" }}
      >
        <Box width="xsmall" align="center">
          1d{props.rollTableModel.dieSize}
        </Box>
        <Box>Result</Box>
      </Box>
      <Box overflow="auto">
        {props.rollTableModel.entries.map((entry, index) => {
          return (
            <Box
              key={index}
              direction="row"
              flex="grow"
              background={entry.isRolled ? "brand-2" : "background"}
              ref={entry.isRolled ? rolledElement : undefined}
            >
              <Box flex={false} width="xsmall" align="center">
                {entry.diceRange}
              </Box>
              <Box>{entry.content}</Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
