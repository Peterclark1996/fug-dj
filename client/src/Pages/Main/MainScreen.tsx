import Action, { ActionType } from '../../Reducer/Action'
import AppState from '../../Reducer/AppState'
import Header from './Header'
import RoomList from './RoomList'
import classes from '../Screen.module.scss'
import Stage from './Stage'
import UserActions from './UserActions'
import PageEnum from '../../Enums/PageEnum'
import MediaLibraryScreen from '../MediaLibrary/MediaLibraryScreen'
import { useQuery } from 'react-query'
import { useApi } from '../../Hooks/ApiProvider'
import UserData from '../../Types/UserData'
import { useEffect } from 'react'
import MediaQueue from './MediaQueue'
import { Endpoint, Resource } from '../../Constants'
import ProfileScreen from '../Profile/ProfileScreen'

type MainScreenProps = {
    state: AppState,
    dispatch: React.Dispatch<Action>
}

const MainScreen = ({ state, dispatch }: MainScreenProps) => {
    const { apiGet } = useApi()
    const { data: userData } = useQuery<UserData, Error>(Resource.USER, (): Promise<UserData> => apiGet(Endpoint.GET_USER))

    useEffect(() => {
        if (userData) {
            dispatch({ type: ActionType.USER_DATA_RETRIEVED, userData })
        }
    }, [dispatch, userData])

    return (
        <div className={`d-flex flex-column ${classes.fullscreen} ${classes.background} ${classes.mainFont}`}>
            <Header />
            <div className="d-flex flex-grow-1">
                <div className="d-flex flex-column">
                    <RoomList />
                    <UserActions dispatch={dispatch} />
                </div>
                <div className={`d-flex flex-column ${classes.stretch}`}>
                    <Stage />
                </div>
                <MediaQueue />
            </div>
            {
                state.selectedPage === PageEnum.Library && <MediaLibraryScreen state={state} dispatch={dispatch} />
            }
            {
                state.selectedPage === PageEnum.Profile && <ProfileScreen state={state} dispatch={dispatch} />
            }
        </div>
    )
}

export default MainScreen