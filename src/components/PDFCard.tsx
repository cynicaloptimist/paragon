import { faArrowsAltH, faArrowsAltV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { CardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";

type Size = {
  width: number;
  height: number;
};

export function PDFCard(props: { card: CardState; outerSize: Size }) {
  const [fitType, setFitType] = useState("width");
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <BaseCard
      cardState={props.card}
      commands={
        <>
          <Button
            icon={<FontAwesomeIcon icon={faArrowsAltV} />}
            onClick={() => setFitType("height")}
            active={fitType === "height"}
          />
          <Button
            icon={<FontAwesomeIcon icon={faArrowsAltH} />}
            onClick={() => setFitType("width")}
            active={fitType === "width"}
          />
        </>
      }
    >
      <Box overflow="auto" alignContent="center">
        <Document file="sample.pdf">
          <Page
            pageNumber={pageNumber}
            width={fitType === "width" ? props.outerSize.width - 40 : undefined}
            height={
              fitType === "height" ? props.outerSize.height - 110 : undefined
            }
          />
        </Document>
      </Box>
    </BaseCard>
  );
}
