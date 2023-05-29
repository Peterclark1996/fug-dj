import { createContext, useContext, ReactNode } from "react"
import useApiQuery from "../hooks/useApiQuery"
import PlaylistDto from "../dtos/PlaylistDto"

const UserMediaContext = createContext<{
    playlists: PlaylistDto[]
    fetchPlaylists: () => void
}>({
    playlists: [],
    fetchPlaylists: () => undefined
})

type UserMediaProviderProps = {
    children: ReactNode
}

export const UserMediaProvider = ({ children }: UserMediaProviderProps) => {
    const userPlaylistsRequest = useApiQuery<PlaylistDto[]>(`playlist`)

    const value = {
        playlists: userPlaylistsRequest.data ?? [],
        fetchPlaylists: userPlaylistsRequest.execute
    }

    return <UserMediaContext.Provider value={value}>{children}</UserMediaContext.Provider>
}

export const useUserMedia = () => useContext(UserMediaContext)
