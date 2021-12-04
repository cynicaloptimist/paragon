import mapValues from "lodash/mapValues";
import pickBy from "lodash/pickBy";
import {
    ref,
    getStorage,
    listAll,
    uploadBytes,
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
        for (const dashboard of Object.values(networkAppState.dashboardsById || {})) {
            if (!dashboard.layoutsBySize) {
                dashboard.layoutsBySize = {}
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
        fileType: string
    ) {
        const storage = getStorage(app);
        const fileRef = ref(storage, `users/${userId}/${fileType}s/${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
    }

    export async function GetCurrentUserUploads(userId: string, fileType: string) {
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

}