import PageEnum from "../Enums/PageEnum"
import UserData from "../Types/UserData"

export enum ActionType {
    SELECTED_PAGE_UPDATED = "SELECTED_PAGE_UPDATED",
    USER_DATA_RETRIEVED = "USER_DATA_RETRIEVED"
}

type Action =
    | { type: ActionType.SELECTED_PAGE_UPDATED, updatedPage: PageEnum }
    | { type: ActionType.USER_DATA_RETRIEVED, userData: UserData }

export default Action