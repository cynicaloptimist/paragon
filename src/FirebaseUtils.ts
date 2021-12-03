import mapValues from "lodash/mapValues";
import pickBy from "lodash/pickBy";
import { AppState, EmptyState } from "./state/AppState";

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
}