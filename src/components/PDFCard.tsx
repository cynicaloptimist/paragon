import {
  ref,
  getStorage,
  listAll,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";
import {
  faArrowsAltH,
  faArrowsAltV,
  faCaretLeft,
  faCaretRight,
  faList,
  faStepBackward,
  faStepForward,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextInput, Paragraph, List } from "grommet";
import { useContext, useEffect, useState } from "react";
import { Document, Outline, Page } from "react-pdf/dist/esm/entry.webpack";
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

type FileNameAndURL = {
  name: string;
  url: string;
};

async function GetCurrentUserUploads(userId: string) {
  const storage = getStorage(app);
  const filesRef = ref(storage, `users/${userId}/pdfs`);
  const files = await listAll(filesRef);
  const fileUrls: FileNameAndURL[] = await Promise.all(
    files.items.map(async (file) => {
      return {
        name: file.name,
        url: await getDownloadURL(file),
      };
    })
  );
  return fileUrls;
}

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

    return <PDFUpload card={props.card} />;
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

function PDFUpload(props: { card: PDFCardState }) {
  const { state, dispatch } = useContext(ReducerContext);
  const userId = useUserId();
  const [uploadedFiles, setUploadedFiles] = useState<FileNameAndURL[] | null>(
    null
  );

  useEffect(() => {
    if (!(userId && state.user.hasStorage)) {
      return;
    }
    GetCurrentUserUploads(userId).then((files) => {
      setUploadedFiles(files);
    });
    return;
  }, [userId, state.user.hasStorage]);

  if (!(userId && state.user.hasStorage)) {
    return (
      <Paragraph>
        Storage not available. Please log in to upload a PDF.
      </Paragraph>
    );
  }

  const uploadedFilesList = uploadedFiles && (
    <List
      style={{ overflowY: "auto" }}
      primaryKey="name"
      data={uploadedFiles}
      onClickItem={(event: { item?: FileNameAndURL; index?: number }) => {
        if (!event.item) {
          return;
        }
        setCardPDF(props.card, dispatch, event.item.name, event.item.url);
      }}
    />
  );

  return (
    <BaseCard cardState={props.card} commands={null}>
      {uploadedFilesList || <Paragraph>Loading...</Paragraph>}
      <Button
        onClick={async () => {
          const file = await GetUserUpload();
          const pdfURL = await UploadUserFileToStorageAndGetURL(file, userId);
          setCardPDF(props.card, dispatch, file.name, pdfURL);
        }}
        label="Upload PDF"
        icon={<FontAwesomeIcon icon={faUpload} />}
      />
    </BaseCard>
  );
}

function setCardPDF(
  card: PDFCardState,
  dispatch: React.Dispatch<any>,
  fileName: string,
  pdfURL: string
) {
  if (card.pdfUrl === "") {
    dispatch(
      CardActions.SetCardTitle({
        cardId: card.cardId,
        title: fileName,
      })
    );
  }

  dispatch(
    CardActions.SetPDFPage({
      cardId: card.cardId,
      page: 1,
    })
  );

  dispatch(CardActions.SetPDFURL({ cardId: card.cardId, pdfURL }));
}
