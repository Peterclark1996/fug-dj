import classes from "./HeadLogo.module.scss"

const HeadLogo = () => {
    return (
        <div className={`flex grow items-center mx-2 ${classes.outlinedText}`}>
            <i className="fa-solid fa-compact-disc fa-2xl text-slate-600" />
            <span className={`${classes.name} font-bold select-none`}>FugDJ</span>
        </div>
    )
}

export default HeadLogo
