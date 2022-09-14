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

  const menuItems = availableCardTypes.map((cardType) => {
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

  return (
    <Menu
      dropAlign={{ right: "right", top: "bottom" }}
      icon={<FontAwesomeIcon icon={faPlus} />}
      label="New Card"
      items={menuItems}
    />
  );
}
