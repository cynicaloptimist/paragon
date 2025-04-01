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
import { Box, TextInput, Button, Drop, Text } from "grommet";
import { useRef, useEffect } from "react";

export const LinkDialog = ({
  dropTargetRef,
}: {
  dropTargetRef: React.RefObject<HTMLDivElement>;
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

  if (!dropTargetRef.current || linkDialogState.type === "inactive") {
    return null;
  }

  return (
    <Drop
      target={dropTargetRef.current}
      stretch={false}
      align={{ top: "bottom", right: "right" }}
    >
      <Box flex direction="row" pad="xsmall" align="center">
        {linkDialogState.type === "edit" && (
          <>
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
          </>
        )}
        {linkDialogState.type === "preview" && (
          <>
            <Text margin={{ left: "xsmall" }}>{linkDialogState.url}</Text>
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
          </>
        )}
      </Box>
    </Drop>
  );
};
