import { faCheck, faEraser, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useCellValues,
  linkDialogState$,
  rootEditor$,
  usePublisher,
  updateLink$,
  removeLink$,
  switchFromPreviewToLinkEdit$,
} from "@mdxeditor/editor";
import { Box, TextInput, Button } from "grommet";
import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export const LinkDialog = ({
  toolbarPortalRef,
}: {
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
}) => {
  const [linkDialogState, rootEditor] = useCellValues(
    linkDialogState$,
    rootEditor$
  );
  const updateLink = usePublisher(updateLink$);
  const removeLink = usePublisher(removeLink$);
  const switchFromPreviewToLinkEdit = usePublisher(
    switchFromPreviewToLinkEdit$
  );

  const textInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log({ linkDialogState });
  }, [linkDialogState]);

  if (!toolbarPortalRef.current) {
    return null;
  }

  if (linkDialogState.type === "edit") {
    return createPortal(
      <Box
        flex
        direction="row"
        fill="horizontal"
        pad={{ top: "small", horizontal: "small" }}
        align="center"
      >
        <TextInput
          ref={textInput}
          defaultValue={linkDialogState.url}
          placeholder="Link URL"
        />
        <Button
          onClick={() => {
            if (textInput.current) {
              updateLink({
                title: linkDialogState.title,
                url: textInput.current.value,
              });
            }
          }}
          icon={<FontAwesomeIcon icon={faCheck} />}
          tip="Update Link"
        />
      </Box>,
      toolbarPortalRef.current
    );
  }

  if (linkDialogState.type === "preview") {
    return createPortal(
      <Box
        flex
        direction="row"
        fill="horizontal"
        pad={{ top: "small", horizontal: "small" }}
        align="center"
      >
        {linkDialogState.url}
        <Button
          onClick={() => {
            removeLink();
          }}
          icon={<FontAwesomeIcon icon={faEraser} />}
          tip="Remove Link"
        />
        <Button
          onClick={() => {
            // If the editor is focused, it will fire a currentSelection$ change and immediately switch back to edit mode.
            rootEditor?.blur();
            switchFromPreviewToLinkEdit();
          }}
          icon={<FontAwesomeIcon icon={faEdit} />}
          tip="Edit Link"
        />
      </Box>,
      toolbarPortalRef.current
    );
  }

  return <div />;
};
