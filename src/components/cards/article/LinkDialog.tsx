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

export const LinkDialog = () => {
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

  if (linkDialogState.type === "edit") {
    return (
      <Box flex direction="row" fill="horizontal" pad="small">
        <TextInput ref={textInput} defaultValue={linkDialogState.url} />
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
        />
      </Box>
    );
  }

  if (linkDialogState.type === "preview") {
    return (
      <Box flex direction="row" fill="horizontal" pad="small">
        {linkDialogState.url}
        <Button
          onClick={() => {
            removeLink();
          }}
          icon={<FontAwesomeIcon icon={faEraser} />}
        />
        <Button
          onClick={() => {
            // If the editor is focused, it will fire a currentSelection$ change and immediately switch back to edit mode.
            rootEditor?.blur();
            switchFromPreviewToLinkEdit();
          }}
          icon={<FontAwesomeIcon icon={faEdit} />}
        />
      </Box>
    );
  }

  return <div />;
};
