import Button from "../../../library/Button"

type UserProps = {
    username: string
}

const User = ({ username }: UserProps) => {
    const onAddUserClick = () => {
        alert("Friend system not implemented yet")
    }

    return (
        <div className="flex items-center mt-4 p-1 rounded outline outline-1 outline-slate-800 form-emboss">
            <div className="px-2">
                <i className="fa-solid fa-user fa-xl pe-1" />
            </div>
            <span className="text-xl me-2">{username}</span>
            <Button className="ms-auto" icon="fa-user-plus" colour="bg-green-500" onClick={onAddUserClick} />
        </div>
    )
}

export default User
