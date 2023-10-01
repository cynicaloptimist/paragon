import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Text,
  Paragraph,
  List,
  FileInput,
  TextInput,
  Box,
  Button,
} from "grommet";
import _ from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import { FileNameAndURL, FirebaseUtils } from "../../FirebaseUtils";
import { ReducerContext } from "../../reducers/ReducerContext";
import { LongPressButton } from "../common/LongPressButton";
import { useUserId } from "../hooks/useAccountSync";

export function FileUpload(props: {
  currentUrl: string;
  onFileSelect: (file: FileNameAndURL) => void;
  fileType: string;
  fileInputAccept?: string;
  allowDirectLink?: boolean;
}) {
  const { state } = useContext(ReducerContext);
  const userId = useUserId();
  const [uploadedFiles, setUploadedFiles] = useState<FileNameAndURL[] | null>(
    null
  );

  useEffect(() => {
    if (!(userId && state.user.hasStorage)) {
      return;
    }
    FirebaseUtils.GetCurrentUserUploads(userId, props.fileType).then(
      (files) => {
        setUploadedFiles(files);
      }
    );
    return;
  }, [userId, state.user.hasStorage, props.fileType]);

  const directUrlInput = (
    <DirectUrlInput
      currentUrl={props.currentUrl}
      onSubmit={(newUrl) => {
        props.onFileSelect({
          name: newUrl,
          url: newUrl,
        });
      }}
    />
  );

  if (!(userId && state.user.hasStorage)) {
    if (props.allowDirectLink) {
      return directUrlInput;
    } else {
      return (
        <Paragraph>
          Storage not available. Please log in to upload a file.
        </Paragraph>
      );
    }
  }

  const uploadedFilesList = uploadedFiles && (
    <List
      style={{ overflowY: "auto" }}
      data={uploadedFiles}
      onClickItem={(event: { item?: FileNameAndURL; index?: number }) => {
        if (!event.item) {
          return;
        }
        props.onFileSelect(event.item);
      }}
      action={(item: FileNameAndURL) => {
        return (
          <LongPressButton
            icon={<FontAwesomeIcon icon={faTrash} />}
            onLongPress={async () => {
              await FirebaseUtils.DeleteFile(userId, props.fileType, item.name);
              if (props.currentUrl === item.url) {
                props.onFileSelect({
                  name: "",
                  url: "",
                });
              }
              setUploadedFiles((files) => {
                if (!files) {
                  return [];
                }
                return _.filter(files, (file) => file.url !== item.url);
              });
            }}
            onClickCapture={(mouseEvent) => {
              // Prevent the click from triggering the list item click
              mouseEvent.stopPropagation();
            }}
          />
        );
      }}
    />
  );

  return (
    <Box align="stretch">
      {uploadedFilesList || <Paragraph>Loading...</Paragraph>}
      <FileInput
        onChange={async (event) => {
          const files = event?.target.files;
          if (!files || !files[0]) {
            return;
          }
          const file = files[0];
          const fileUrl = await FirebaseUtils.UploadUserFileToStorageAndGetURL(
            file,
            userId,
            props.fileType,
            (currentBytes, totalBytes) => {
              console.log(`${currentBytes}/${totalBytes} uploaded`);
            }
          );
          props.onFileSelect({
            name: file.name,
            url: fileUrl,
          });
        }}
        accept={props.fileInputAccept}
      />
      {props.allowDirectLink && directUrlInput}
    </Box>
  );
}

export function DirectUrlInput(props: {
  currentUrl: string;
  onSubmit: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Box direction="row" align="center">
      <Text margin="small">URL: </Text>
      <TextInput
        aria-label="URL"
        ref={inputRef}
        defaultValue={props.currentUrl}
      />
      <Button
        onClick={() => props.onSubmit(inputRef.current!.value)}
        icon={<FontAwesomeIcon icon={faCheck} />}
      />
    </Box>
  );
}
