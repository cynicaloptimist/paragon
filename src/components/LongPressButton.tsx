import { Button, ButtonType, Meter, Stack } from "grommet";
import React, { useCallback, useRef, useState } from "react";

const DRAW_INTERVAL = 20;

export function LongPressButton(
  props: Omit<ButtonType, "onClick"> & {
    timeout?: number;
    onLongPress: () => void;
  }
) {
  const { onLongPress, ...buttonProps } = props;
  const timeout = props.timeout || 1000;

  const [pressLength, setPressLength] = useState(0);
  const pressLengthRef = useRef(pressLength);
  pressLengthRef.current = pressLength;

  const interval = useRef<NodeJS.Timeout>();

  const press = useCallback(() => {
    if (!interval.current) {
      interval.current = setInterval(() => {
        if (pressLengthRef.current > timeout) {
          setPressLength(0);
          onLongPress();
        } else {
          setPressLength(pressLengthRef.current + DRAW_INTERVAL);
        }
      }, DRAW_INTERVAL);
    }
  }, [onLongPress, timeout]);

  const unPress = useCallback(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
    setPressLength(0);
  }, [interval, setPressLength]);

  return (
    <Stack anchor="center">
      <Meter
        type="circle"
        max={timeout}
        values={[
          {
            value: pressLength,
            color: "status-warning",
          },
        ]}
        size="40px"
        thickness="xsmall"
        margin={{
          top: "3px",
          bottom: "-3px",
        }}
        background="transparent"
      />
      <Button
        {...buttonProps}
        onMouseDown={press}
        onMouseUp={unPress}
        onMouseLeave={unPress}
        onTouchStart={press}
        onTouchEnd={unPress}
        onTouchCancel={unPress}
      />
    </Stack>
  );
}
