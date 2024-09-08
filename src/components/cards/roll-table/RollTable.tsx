import { Box } from "grommet";
import { useEffect, useRef } from "react";
import { RollTableModel } from "./GetRollTableModel";
import { animated, config, useSpring } from "@react-spring/web";
import { ReactComponent as Logo } from "../../../dm-screen-regular.svg";
import { useThemeColor } from "../../hooks/useThemeColor";
import { useIsCardPinned } from "../../hooks/useIsCardPinned";

export function RollTable(props: { rollTableModel: RollTableModel }) {
  const [springs, springApi] = useSpring(() => ({}));

  const rolledElement = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(rolledElement.current && scrollContainer.current)) {
      return;
    }
    const originalOffset = scrollContainer.current.scrollTop;

    const scrollTarget =
      rolledElement.current.offsetTop +
      rolledElement.current.clientHeight / 2 -
      scrollContainer.current.clientHeight / 2;

    scrollContainer.current.scrollTop = scrollTarget;

    const scrollDifference = scrollContainer.current.scrollTop - originalOffset;

    springApi.start({
      from: { y: scrollDifference },
      to: { y: 0 },
      config: config.gentle,
    });
  }, [rolledElement, props.rollTableModel.rollResult, springApi]);

  const color = useThemeColor("brand");

  const isPinned = useIsCardPinned(props.rollTableModel.cardId);

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
        <Box>{isPinned ? props.rollTableModel.cardTitle : "Result"}</Box>
      </Box>
      <Box overflow="auto" ref={scrollContainer}>
        <SpinBox
          style={{
            ...springs,
            position: "relative",
          }}
        >
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
          <Box direction="row" flex="grow" justify="center" margin="20px">
            <Logo color={color} height={50} />
          </Box>
        </SpinBox>
      </Box>
    </Box>
  );
}

const SpinBox = animated(Box);
