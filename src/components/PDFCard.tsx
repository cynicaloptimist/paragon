import { Box } from "grommet";
import React from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { CardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";

type Size = {
  width: number;
  height: number;
};

export function PDFCard(props: { card: CardState; outerSize: Size }) {
  return (
    <BaseCard cardState={props.card} commands={null}>
      <Box overflow="auto" alignContent="center">
        <Document file="sample.pdf">
          <Page pageNumber={1} width={props.outerSize.width - 100} />
        </Document>
      </Box>
    </BaseCard>
  );
}
