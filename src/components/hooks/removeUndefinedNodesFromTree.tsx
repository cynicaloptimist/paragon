import mapValues from "lodash/mapValues";
import pickBy from "lodash/pickBy";
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
