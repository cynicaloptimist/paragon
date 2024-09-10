import { AppReducer } from "../reducers/AppReducer";
import { GetInitialState } from "../state/GetInitialState";
import { DashboardActions } from "./DashboardActions";

describe("AddCard", () => {
  it("Adding an article card should add a default Article Card to the state", () => {
    const state = GetInitialState();
    const action = DashboardActions.AddCard({
      cardId: "1",
      cardType: "article",
      dashboardId: "1",
    });
    const result = AppReducer(state, action);

    expect(result.cardsById["1"]).toEqual({
      cardId: "1",
      content: "",
      playerViewPermission: "visible",
      title: "Article",
      type: "article",
    });
  });
});
