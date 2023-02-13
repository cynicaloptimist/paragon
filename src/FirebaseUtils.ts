import mapValues from "lodash/mapValues";
import pickBy from "lodash/pickBy";
import {
  ref,
  getStorage,
  getBlob,
  listAll,
  deleteObject,
  uploadString,
  uploadBytesResumable,
  getDownloadURL,
} from "@firebase/storage";

import { app } from "./";
import { AppState, EmptyState } from "./state/AppState";

export type FileNameAndURL = {
  name: string;
  url: string;
};

export namespace FirebaseUtils {
  export function removeUndefinedNodesFromTree(object: any): any {
    if (typeof object !== "object") {
      return object;
    }

    if (Array.isArray(object)) {
      return object.map(removeUndefinedNodesFromTree);
    }

    return mapValues(
      pickBy(object, (value) => value !== undefined),
      removeUndefinedNodesFromTree
    );
  }

  export function restorePrunedEmptyArrays(
    networkAppState: Partial<AppState>
  ): AppState {
    for (const dashboard of Object.values(
      networkAppState.dashboardsById || {}
    )) {
      if (!dashboard.layoutsBySize) {
        dashboard.layoutsBySize = {};
      }
      for (const size of Object.keys(dashboard.layoutsBySize)) {
        dashboard.layoutsBySize[size] = dashboard.layoutsBySize[size] || [];
      }
      dashboard.openCardIds = dashboard.openCardIds || [];
    }

    return {
      ...EmptyState(),
      ...networkAppState,
    };
  }

  export async function UploadUserFileToStorageAndGetURL(
    file: File,
    userId: string,
    fileType: string,
    onProgress?: (currentBytes: number, totalBytes: number) => void
  ) {
    const storage = getStorage(app);
    const fileRef = ref(storage, `users/${userId}/${fileType}s/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);
    if (onProgress) {
      uploadTask.on("state_changed", (snapshot) => {
        onProgress(snapshot.bytesTransferred, snapshot.totalBytes);
      });
    }

    await uploadTask;

    return getDownloadURL(fileRef);
  }

  export async function GetCurrentUserUploads(
    userId: string,
    fileType: string
  ) {
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

  export async function DeleteFile(
    userId: string,
    fileType: string,
    fileName: string
  ): Promise<void> {
    const storage = getStorage(app);
    const fileRef = ref(storage, `users/${userId}/${fileType}s/${fileName}`);
    return deleteObject(fileRef);
  }

  export async function SetCardFiles(
    userId: string,
    cardId: string,
    files: any
  ) {
    const storage = getStorage(app);
    const cardsRef = ref(storage, `users/${userId}/cardFiles/${cardId}`);
    const filesString = JSON.stringify(files);
    return await uploadString(cardsRef, filesString);
  }

  export async function GetCardFiles(userId: string, cardId: string) {
    try {
      const storage = getStorage(app);
      const cardsRef = ref(storage, `users/${userId}/cardFiles/${cardId}`);
      const blob = await getBlob(cardsRef);
      const text = await blob.text();
      const files = JSON.parse(text);
      return files;
    } catch (e) {
      return {};
    }
  }
}
