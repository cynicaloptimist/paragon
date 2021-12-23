import { Box } from "grommet";
import React, { useEffect, useRef } from "react";
import { RollTableModel } from "./GetRollTableModel";

export function RollTableHistory(props: {
  rollTableModel: RollTableModel;
  rollHistory: number[];
}) {
  const scrollBottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollBottom.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [props.rollHistory]);

  return (
    <Box>
      <Box
        direction="row"
        flex="grow"
        pad={{ vertical: "xsmall" }}
        style={{ fontWeight: "bold", borderBottom: "1px solid" }}
      >
        <Box width="xsmall" align="center">
          Rolled
        </Box>
        <Box>Result History</Box>
      </Box>
      <Box overflow="auto">
        {props.rollHistory.map((roll, index) => {
          return (
            <Box
              key={index}
              direction="row"
              flex="grow"
              background={
                index === props.rollHistory.length - 1 ? "brand-2" : ""
              }
            >
              <Box flex={false} width="xsmall" align="center">
                {roll}
              </Box>
              <Box>{props.rollTableModel.entries[roll - 1].content}</Box>
            </Box>
          );
        })}
        <Box ref={scrollBottom} />
      </Box>
    </Box>
  );
}
