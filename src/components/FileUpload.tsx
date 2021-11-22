import {
  ref,
  getStorage,
  listAll,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";
import { Paragraph, List, FileInput } from "grommet";
import { useContext, useEffect, useState } from "react";
import { app } from "..";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { useUserId } from "./hooks/useAccountSync";

type FileNameAndURL = {
  name: string;
  url: string;
};

export function FileUpload(props: {
  card: CardState;
  onFileSelect: (file: FileNameAndURL) => void;
  fileType: string;
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
    GetCurrentUserUploads(userId, props.fileType).then((files) => {
      setUploadedFiles(files);
    });
    return;
  }, [userId, state.user.hasStorage, props.fileType]);

  if (!(userId && state.user.hasStorage)) {
    return (
      <Paragraph>
        Storage not available. Please log in to upload a file.
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
        props.onFileSelect(event.item);
      }}
    />
  );

  return (
    <BaseCard cardState={props.card} commands={null}>
      {uploadedFilesList || <Paragraph>Loading...</Paragraph>}
      <FileInput
        onChange={async (event) => {
          const files = event.target.files;
          if (!files) {
            return;
          }
          const file = files[0];
          const fileUrl = await UploadUserFileToStorageAndGetURL(
            file,
            userId,
            props.fileType
          );
          props.onFileSelect({
            name: file.name,
            url: fileUrl,
          });
        }}
        accept={`.${props.fileType}`}
      />
    </BaseCard>
  );
}

async function UploadUserFileToStorageAndGetURL(
  file: File,
  userId: string,
  fileType: string
) {
  const storage = getStorage(app);
  const fileRef = ref(storage, `users/${userId}/${fileType}s/${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

async function GetCurrentUserUploads(userId: string, fileType: string) {
  const storage = getStorage(app);
  const filesRef = ref(storage, `users/${userId}/${fileType}s`);
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