type SliderProps = {
    min?: number
    max?: number
    value: number
    onChange?: (value: number) => void
}

const Slider = ({ min = 0, max = 100, value, onChange }: SliderProps) => {
    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        onChange && onChange(Number(event.target.value))

    return (
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={onInputChange}
            disabled={onChange === undefined}
        />
    )
}

export default Slider
