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
import { useEffect, useContext, useState, ReactElement } from "react";
import { ReducerContext } from "../../../reducers/ReducerContext";
import _, { set } from "lodash";
import CardStack from "../../../cards-regular.svg?react";
import { CardState } from "../../../state/CardState";
import { CardLink } from "./CardLink";

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

  const [linkUrlOrCardId, setLinkUrlOrCardId] = useState<string | undefined>(
    undefined
  );
  const [linkTitle, setLinkTitle] = useState<string | undefined>(undefined);

  const linkableCards = Object.values(state.cardsById).filter(
    (card) =>
      state.activeCampaignId && card.campaignId === state.activeCampaignId
  );

  const linkedCard =
    linkDialogState.type !== "inactive"
      ? linkableCards.find((card) => card.cardId === linkDialogState.url)
      : undefined;

  useEffect(() => {
    if (linkDialogState.type !== "inactive") {
      setLinkUrlOrCardId(linkDialogState.url);
      setLinkTitle(linkDialogState.title);
      if (linkedCard) {
        setLinkType("card");
      }
    }
  }, [linkDialogState, linkedCard]);

  if (!dropTargetRef.current || linkDialogState.type === "inactive") {
    return null;
  }

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
                onChange={(e) => setLinkUrlOrCardId(e.target.value)}
                defaultValue={linkDialogState.url}
                placeholder="Link URL"
              />
            )}
            {linkType === "card" && (
              <Select
                placeholder="Link Card"
                value={linkUrlOrCardId}
                valueKey={{ key: "cardId", reduce: true }}
                labelKey="cardTitle"
                options={linkableCards.map((card) => ({
                  cardTitle: card.title,
                  cardId: card.cardId,
                }))}
                onChange={({ option }) => {
                  setLinkUrlOrCardId(option.cardId);
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
              disabled={!linkUrlOrCardId}
              onClick={() => {
                updateLink({
                  title: linkTitle ?? linkDialogState.title,
                  url: linkUrlOrCardId ?? linkDialogState.url,
                });
              }}
              icon={<FontAwesomeIcon icon={faCheck} />}
              tip="Update Link"
            />
          </>
        )}
        {linkDialogState.type === "preview" && (
          <>
            <Text margin={{ left: "xsmall" }}>
              {linkedCard ? (
                <CardLinkPreview cardState={linkedCard} />
              ) : (
                linkDialogState.url
              )}
            </Text>
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

function CardLinkPreview({ cardState }: { cardState: CardState }) {
  return <CardLink href={cardState.cardId}>{cardState.title}</CardLink>;
}
