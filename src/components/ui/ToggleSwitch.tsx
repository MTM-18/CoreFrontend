type ToggleOption = {
    value: string;
    label: string;
};

type ToggleSwitchProps = {
    options: ToggleOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
};

export default function ToggleSwitch({
    options,
    value,
    onChange,
    className = "",
}: ToggleSwitchProps) {
    return (
        <div className={`switch-root ${className}`}>
            {options.map((opt) => {
                const isActive = opt.value === value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => !isActive && onChange(opt.value)}
                        className={
                            "switch-option " +
                            (isActive ? "switch-option-active" : "switch-option-inactive")
                        }
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
