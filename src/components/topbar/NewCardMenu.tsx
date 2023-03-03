import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "grommet";
import { useContext } from "react";
import { DashboardActions } from "../../actions/DashboardActions";
import { randomString } from "../../randomString";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CardTypeFriendlyNames } from "../../state/CardTypes";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";

export function NewCardMenu() {
  const { state, dispatch } = useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();

  const availableCardTypes = state.appSettings.cardTypesInMenu.filter(
    (cardType) => {
      if (cardType === "info") {
        return false;
      }

      if (cardType === "pdf") {
        return state.user.hasStorage;
      }

      return true;
    }
  );

  const cardTypes = availableCardTypes.map((cardType) => {
    return {
      label: CardTypeFriendlyNames[cardType],
      onClick: () => {
        const cardId = randomString();
        if (dashboardId) {
          dispatch(
            DashboardActions.AddCard({
              dashboardId,
              cardId,
              cardType,
            })
          );
        }
      },
    };
  });

  const templateTypes = Object.values(state.appSettings.templateIdsInMenu).map(
    (templateId) => {
      const template = state.templatesById[templateId];
      if (!template) {
        console.error(`Template ${templateId} not found`);
        return {};
      }
      return {
        label: template.title,
        onClick: () => {
          const cardId = randomString();
          if (dashboardId) {
            dispatch(
              DashboardActions.AddCardFromTemplate({
                dashboardId,
                cardId,
                templateId: template.cardId,
                cardType: template.type,
              })
            );
          }
        },
      };
    }
  );

  const menuItems = templateTypes.length
    ? [cardTypes, templateTypes]
    : cardTypes;

  return (
    <Menu
      dropAlign={{ right: "right", top: "bottom" }}
      icon={<FontAwesomeIcon icon={faPlus} />}
      label="New Card"
      items={menuItems}
    />
  );
}
