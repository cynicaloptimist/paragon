import _ from "lodash";
import React from "react";

export function useThrottledTrailing<T extends (...args: any) => any>(
  method: T,
  timeout: number
) {
  return React.useMemo(() => {
    return _.throttle(method, timeout, {
      leading: false,
      trailing: true,
    });
  }, [method]);
}
