import {
  faArrowsAltH,
  faArrowsAltV,
  faCaretLeft,
  faCaretRight,
  faList,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextInput, Paragraph } from "grommet";
import { useContext, useState } from "react";
import { Document, Outline, Page } from "react-pdf/dist/esm/entry.webpack";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { PDFCardState, PlayerViewPermission } from "../../state/CardState";
import { BaseCard } from "./BaseCard";
import { FileUpload } from "./FileUpload";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";

type Size = {
  width: number;
  height: number;
};

export function PDFCard(props: { card: PDFCardState; outerSize: Size }) {
  const [fitType, setFitType] = useState("width");
  const [pageCount, setPageCount] = useState(1);
  const [outlineVisible, setOutlineVisible] = useState(false);
  const { dispatch } = useContext(ReducerContext);
  const viewType = useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  if (props.card.pdfUrl === "") {
    if (!canEdit) {
      return <Paragraph>No PDF Uploaded.</Paragraph>;
    }

    return (
      <BaseCard cardState={props.card} commands={null}>
        <FileUpload
          card={props.card}
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
      dispatch(CardActions.SetPDFPage({ cardId: props.card.cardId, page: 1 }));
    } else if (pageNumber > pageCount) {
      dispatch(
        CardActions.SetPDFPage({ cardId: props.card.cardId, page: pageCount })
      );
    } else {
      dispatch(
        CardActions.SetPDFPage({ cardId: props.card.cardId, page: pageNumber })
      );
    }
  };

  return (
    <BaseCard
      centerRow={!outlineVisible}
      cardState={props.card}
      commands={
        <>
          <Button
            icon={<FontAwesomeIcon icon={faList} />}
            onClick={() => setOutlineVisible(!outlineVisible)}
            active={outlineVisible}
          />
          <Button
            icon={<FontAwesomeIcon icon={faStepBackward} />}
            onClick={() => setPageNumberBounded(1)}
          />
          <Button
            icon={<FontAwesomeIcon icon={faCaretLeft} />}
            onClick={() => setPageNumberBounded(props.card.currentPage - 1)}
          />
          <Box style={{ width: "60px" }} flex="grow">
            <TextInput
              type="number"
              value={props.card.currentPage}
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
            onClick={() => setPageNumberBounded(props.card.currentPage + 1)}
          />
          <Button
            icon={<FontAwesomeIcon icon={faStepForward} />}
            onClick={() => setPageNumberBounded(pageCount)}
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
              pageNumber={
                isNaN(props.card.currentPage) ? 1 : props.card.currentPage
              }
              width={
                fitType === "width" ? props.outerSize.width - 40 : undefined
              }
              height={
                fitType === "height" ? props.outerSize.height - 110 : undefined
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
  dispatch: React.Dispatch<any>,
  fileName: string,
  pdfURL: string
) {
  dispatch(
    CardActions.SetPDF({ cardId: card.cardId, pdfURL, pdfTitle: fileName })
  );
}
