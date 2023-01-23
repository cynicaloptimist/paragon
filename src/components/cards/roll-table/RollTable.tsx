import { Box } from "grommet";
import { useEffect, useRef } from "react";
import { RollTableModel } from "./GetRollTableModel";
import { animated, useSpring } from "@react-spring/web";

export function RollTable(props: { rollTableModel: RollTableModel }) {
  const [springs, springApi] = useSpring(() => ({}));

  const rolledElement = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(rolledElement.current && scrollContainer.current)) {
      return;
    }
    const scrollDifference =
      rolledElement.current.offsetTop - scrollContainer.current.scrollTop;
    rolledElement.current.scrollIntoView({
      block: "center",
    });

    springApi.start({ from: { y: scrollDifference }, to: { y: 0 } });
  }, [rolledElement, props.rollTableModel.rollResult, springApi]);

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
      <Box overflow="auto" ref={scrollContainer}>
        <SpinBox style={springs}>
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
        </SpinBox>
      </Box>
    </Box>
  );
}

const SpinBox = animated(Box);
