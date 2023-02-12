import {
  faArrowsAltH,
  faArrowsAltV,
  faCaretLeft,
  faCaretRight,
  faFileUpload,
  faList,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextInput, Paragraph } from "grommet";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Document, Outline, Page } from "react-pdf/dist/esm/entry.vite";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { PDFCardState, PlayerViewPermission } from "../../state/CardState";
import BaseCard from "./base/BaseCard";
import { FileUpload } from "./FileUpload";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";
import { RootAction } from "../../actions/Actions";

import "react-pdf/dist/esm/Page/TextLayer.css";

type Size = {
  width: number;
  height: number;
};

export default function PDFCard(props: {
  card: PDFCardState;
  outerSize: Size;
}) {
  const [fitType, setFitType] = useState("width");
  const [pageCount, setPageCount] = useState(1);
  const [outlineVisible, setOutlineVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(props.card.currentPage);
  const { dispatch } = useContext(ReducerContext);
  const viewType = useContext(ViewTypeContext);
  const innerBox = useRef<HTMLDivElement>(null);
  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  useEffect(() => {
    if (!canEdit) {
      setCurrentPage(props.card.currentPage);
    }
  }, [props.card.currentPage, canEdit]);

  if (props.card.pdfUrl === "") {
    if (!canEdit) {
      return <Paragraph>No PDF Uploaded.</Paragraph>;
    }

    return (
      <BaseCard cardState={props.card} commands={null}>
        <FileUpload
          currentUrl={props.card.pdfUrl}
          onFileSelect={(file) => {
            setCardPDF(props.card, dispatch, file.name, file.url);
          }}
          fileType="pdf"
          fileInputAccept=".pdf"
        />
      </BaseCard>
    );
  }

  const setPageNumberBounded = (pageNumber: number) => {
    if (pageNumber < 1) {
      pageNumber = 1;
    }
    if (pageNumber > pageCount) {
      pageNumber = pageCount;
    }

    if (viewType !== ViewType.Player) {
      dispatch(
        CardActions.SetPDFPage({ cardId: props.card.cardId, page: pageNumber })
      );
    }
    setCurrentPage(pageNumber);
  };

  const commands = (
    <>
      <Button
        icon={<FontAwesomeIcon icon={faFileUpload} />}
        tip="Select or upload PDF"
        onClick={() => clearCardPDF(props.card, dispatch)}
      />
      <Button
        icon={<FontAwesomeIcon icon={faList} />}
        tip="Toggle outline"
        onClick={() => setOutlineVisible(!outlineVisible)}
        active={outlineVisible}
      />
      <Button
        icon={<FontAwesomeIcon icon={faStepBackward} />}
        onClick={() => setPageNumberBounded(1)}
      />
      <Button
        icon={<FontAwesomeIcon icon={faCaretLeft} />}
        onClick={() => setPageNumberBounded(currentPage - 1)}
      />
      <Box style={{ width: "60px" }} flex="grow">
        <TextInput
          type="number"
          value={currentPage}
          className="no-spinner"
          style={{ textAlign: "center" }}
          onChange={(changeEvent) =>
            setPageNumberBounded(parseInt(changeEvent.target.value))
          }
          onFocus={(focusEvent) => focusEvent.target.select()}
        />
      </Box>
      <Button
        icon={<FontAwesomeIcon icon={faCaretRight} />}
        onClick={() => setPageNumberBounded(currentPage + 1)}
      />
      <Button
        icon={<FontAwesomeIcon icon={faStepForward} />}
        onClick={() => setPageNumberBounded(pageCount)}
      />
      <Button
        icon={<FontAwesomeIcon icon={faArrowsAltV} />}
        onClick={() => setFitType("height")}
        tip="Fit document to card height"
        active={fitType === "height"}
      />
      <Button
        icon={<FontAwesomeIcon icon={faArrowsAltH} />}
        onClick={() => setFitType("width")}
        tip="Fit document to card width"
        active={fitType === "width"}
      />
    </>
  );

  return (
    <BaseCard
      centerRow={!outlineVisible}
      cardState={props.card}
      onKeyDown={(keyboardEvent) => {
        if (["ArrowLeft", "PageUp"].includes(keyboardEvent.key)) {
          setPageNumberBounded(currentPage - 1);
        }
        if (["ArrowRight", "PageDown"].includes(keyboardEvent.key)) {
          setPageNumberBounded(currentPage + 1);
        }
        if (["Home"].includes(keyboardEvent.key)) {
          setPageNumberBounded(1);
        }
        if (["End"].includes(keyboardEvent.key)) {
          setPageNumberBounded(pageCount);
        }
      }}
      commands={commands}
      innerBoxRef={innerBox}
    >
      <Box overflow="auto" align="center">
        <Document
          file={props.card.pdfUrl}
          onLoadSuccess={(document) => {
            setPageCount(document.numPages);
          }}
        >
          {outlineVisible ? (
            <Outline
              key={props.card.pdfUrl}
              onItemClick={(item) => {
                setPageNumberBounded(parseInt(item.pageNumber));
                setOutlineVisible(false);
              }}
            />
          ) : (
            <Page
              pageNumber={isNaN(currentPage) ? 1 : currentPage}
              width={
                fitType === "width"
                  ? (innerBox.current?.clientWidth ?? 30) - 30
                  : undefined
              }
              height={
                fitType === "height"
                  ? (innerBox.current?.clientHeight ?? 30) - 30
                  : undefined
              }
              renderAnnotationLayer={false}
            />
          )}
        </Document>
      </Box>
    </BaseCard>
  );
}

function setCardPDF(
  card: PDFCardState,
  dispatch: React.Dispatch<RootAction>,
  fileName: string,
  pdfURL: string
) {
  dispatch(
    CardActions.SetPDF({ cardId: card.cardId, pdfURL, pdfTitle: fileName })
  );
}

function clearCardPDF(
  card: PDFCardState,
  dispatch: React.Dispatch<RootAction>
) {
  dispatch(
    CardActions.SetPDF({ cardId: card.cardId, pdfURL: "", pdfTitle: "" })
  );
}
