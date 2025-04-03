import {
  faCheck,
  faEraser,
  faEdit,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
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
import { Box, TextInput, Button, Drop, Text, Select } from "grommet";
import {
  useEffect,
  useContext,
  useState,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import { ReducerContext } from "../../../reducers/ReducerContext";
import _ from "lodash";
import CardStack from "../../../cards-regular.svg?react";

export const LinkDialog = ({
  dropTargetRef,
}: {
  dropTargetRef: React.RefObject<HTMLDivElement>;
}) => {
  const { state } = useContext(ReducerContext);

  const [linkDialogState, rootEditor] = useCellValues(
    linkDialogState$,
    rootEditor$
  );
  const updateLink = usePublisher(updateLink$);
  const removeLink = usePublisher(removeLink$);
  const switchFromPreviewToLinkEdit = usePublisher(
    switchFromPreviewToLinkEdit$
  );
  const [linkType, setLinkType] = useState<"url" | "card">("url");
  const [cardLink, setCardLink] = useState<string | null>(null);

  useEffect(() => {
    if (linkDialogState.type !== "inactive") {
      setCardLink(linkDialogState.url);
    }
  }, [linkDialogState]);

  if (!dropTargetRef.current || linkDialogState.type === "inactive") {
    return null;
  }

  const linkableCards = Object.values(state.cardsById).filter(
    (card) =>
      state.activeCampaignId && card.campaignId === state.activeCampaignId
  );

  return (
    <Drop
      target={dropTargetRef.current}
      stretch={false}
      align={{ top: "bottom", right: "right" }}
      round="xsmall"
      background="background"
    >
      <Box flex direction="row" pad="xsmall" align="center">
        {linkDialogState.type === "edit" && (
          <>
            {linkType === "url" && (
              <TextInput
                onChange={(e) => setCardLink(e.target.value)}
                defaultValue={linkDialogState.url}
                placeholder="Link URL"
              />
            )}
            {linkType === "card" && (
              <Select
                placeholder="Link Card"
                options={linkableCards.map((card) => ({
                  label: card.title,
                  value: card.cardId,
                }))}
                onChange={({ option }) => {
                  setCardLink(option.value);
                }}
              />
            )}

            <Button
              icon={<FontAwesomeIcon icon={faLink} />}
              onClick={() => setLinkType("url")}
              active={linkType === "url"}
            />
            <Button
              icon={<CardStack height={18} />}
              onClick={() => setLinkType("card")}
              active={linkType === "card"}
            />
            <Button
              disabled={!cardLink}
              onClick={() => {
                if (cardLink) {
                  updateLink({
                    title: linkDialogState.title,
                    url: cardLink,
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
