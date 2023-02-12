import { Box, Markdown } from "grommet";
import { InfoCardState } from "../../../state/CardState";
import BaseCard from "../base/BaseCard";
import { CardLink } from "./CardLink";

export default function InfoCard(props: { card: InfoCardState }) {
  const { card } = props;

  return (
    <BaseCard cardState={card} commands={null}>
      <Box fill pad="small" overflow={{ vertical: "auto" }}>
        <Markdown
          style={{ whiteSpace: "pre-wrap" }}
          components={{
            a: {
              component: CardLink,
            },
          }}
        >
          {card.content.replace(/\\\n/g, "\n")}
        </Markdown>
      </Box>
    </BaseCard>
  );
}
