import React, {memo, useEffect, useState} from "react";

interface SelectProps extends React.SelectHTMLAttributes<any> {
    onChange: (any:any) => void,
}

const Select: React.FC<SelectProps> = ({
                                           value,
                                           children,
                                           onChange,
                                           ...props
                                       }) => {
    const [currentValue, setValue] = useState(value || '');

    useEffect(() => {
        setValue(value || '');
    }, [value])

    const changeHandler = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(ev.target.value);
        if (value !== ev.target.value) {
            onChange(ev.target.value);
        }
    }

    return (
        <select className="form-select form-select-sm" value={currentValue} {...props}
                onChange={changeHandler}>
            {children}
        </select>
    )
}

export default memo(Select);
