import {
  faArrowsAltH,
  faArrowsAltV,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextInput } from "grommet";
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
  const [pageCount, setPageCount] = useState(1);
  const setPageNumberBounded = (pageNumber: number) => {
    if (pageNumber < 1) {
      setPageNumber(1);
    } else if (pageNumber > pageCount) {
      setPageNumber(pageCount);
    } else {
      setPageNumber(pageNumber);
    }
  };

  return (
    <BaseCard
      cardState={props.card}
      commands={
        <>
          <Button
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
            onClick={() => setPageNumberBounded(pageNumber - 1)}
          />
          <Box style={{ width: "100px" }}>
            <TextInput
              type="number"
              value={pageNumber}
              className="no-spinner"
              style={{ textAlign: "center" }}
              onChange={(changeEvent) =>
                setPageNumberBounded(parseInt(changeEvent.target.value))
              }
              onFocus={(focusEvent) => focusEvent.target.select()}
            />
          </Box>
          <Button
            icon={<FontAwesomeIcon icon={faChevronRight} />}
            onClick={() => setPageNumberBounded(pageNumber + 1)}
          />
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
        <Document
          file="sample.pdf"
          onLoadSuccess={(document) => {
            setPageCount(document.numPages);
          }}
        >
          <Page
            pageNumber={isNaN(pageNumber) ? 1 : pageNumber}
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
