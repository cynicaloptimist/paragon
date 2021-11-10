import {
  ref,
  getStorage,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";
import {
  faArrowsAltH,
  faArrowsAltV,
  faCaretLeft,
  faCaretRight,
  faStepBackward,
  faStepForward,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextInput, Text } from "grommet";
import { useContext, useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { app } from "..";
import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import { PDFCardState, PlayerViewPermission } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { useUserId } from "./hooks/useAccountSync";
import { ViewType, ViewTypeContext } from "./ViewTypeContext";

type Size = {
  width: number;
  height: number;
};

function GetUserUpload() {
  return new Promise<File>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e: any) => {
      if (e.target?.files?.length > 0) {
        resolve(e.target.files[0] as File);
      } else {
        reject();
      }
    };
    input.click();
  });
}

async function UploadUserFileToStorageAndGetURL(file: File, userId: string) {
  const storage = getStorage(app);
  const fileRef = ref(storage, `users/${userId}/pdfs/${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export function PDFCard(props: { card: PDFCardState; outerSize: Size }) {
  const [fitType, setFitType] = useState("width");
  const [pageCount, setPageCount] = useState(1);
  const { state, dispatch } = useContext(ReducerContext);
  const userId = useUserId();
  const viewType = useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  if (props.card.pdfUrl === "") {
    if (!canEdit) {
      return <Text>No PDF Uploaded.</Text>;
    }

    if (!(userId && state.user.hasStorage)) {
      return <Text>Storage not available. Please log in to upload a PDF.</Text>;
    }

    return (
      <BaseCard cardState={props.card} commands={null}>
        <Button
          onClick={async () => {
            const file = await GetUserUpload();
            const pdfURL = await UploadUserFileToStorageAndGetURL(file, userId);
            if (props.card.pdfUrl === "") {
              dispatch(
                CardActions.SetCardTitle({
                  cardId: props.card.cardId,
                  title: file.name,
                })
              );
            }
            dispatch(
              CardActions.SetPDFURL({ cardId: props.card.cardId, pdfURL })
            );
          }}
          label="Upload PDF"
          icon={<FontAwesomeIcon icon={faUpload} />}
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
      cardState={props.card}
      commands={
        <>
          <Button
            icon={<FontAwesomeIcon icon={faStepBackward} />}
            onClick={() => setPageNumberBounded(1)}
          />
          <Button
            icon={<FontAwesomeIcon icon={faCaretLeft} />}
            onClick={() => setPageNumberBounded(props.card.currentPage - 1)}
          />
          <Box style={{ width: "100px" }}>
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
          <Page
            pageNumber={
              isNaN(props.card.currentPage) ? 1 : props.card.currentPage
            }
            width={fitType === "width" ? props.outerSize.width - 40 : undefined}
            height={
              fitType === "height" ? props.outerSize.height - 110 : undefined
            }
            renderAnnotationLayer={false}
          />
        </Document>
      </Box>
    </BaseCard>
  );
}
