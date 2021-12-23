import * as React from "react";
import { PieChart } from "react-minimal-pie-chart";
import { Data as PieChartData } from "react-minimal-pie-chart/types/commonTypes";
import { ClockCardState, PlayerViewPermission } from "../../../state/CardState";
import { useThemeColor } from "../../hooks/useThemeColor";
import { ViewType, ViewTypeContext } from "../../ViewTypeContext";
import { useOnClickSegment } from "./useOnClickSegment";

export function ClockFace(props: { card: ClockCardState }) {
  const onClickSegment = useOnClickSegment(props);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);
  const viewType = React.useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  const brandColor = useThemeColor("brand");
  const offColor = useThemeColor("light-6");
  const hoverColor = useThemeColor("brand-2");

  let segments: PieChartData = [];
  for (let i = 0; i < props.card.max; i++) {
    let color = offColor;
    if (i < props.card.value) {
      color = brandColor;
    }
    if (i === hoveredIndex) {
      color = hoverColor;
    }

    segments.push({
      color,
      value: 1,
    });
  }
  return (
    <PieChart
      data={segments}
      onClick={canEdit ? (e, index) => onClickSegment(index) : undefined}
      onMouseOver={canEdit ? (e, index) => setHoveredIndex(index) : undefined}
      onMouseOut={() => setHoveredIndex(-1)}
      startAngle={-90}
      segmentsShift={2}
      radius={48}
    />
  );
}
