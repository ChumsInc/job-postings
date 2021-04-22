import React, {memo, useEffect, useState} from "react";

interface InputProps extends React.InputHTMLAttributes<any> {
    onChange: (any: any) => void,
}

const Input: React.FC<InputProps> = ({
                                         type = 'text',
                                         value = '',
                                         children,
                                         onChange,
                                         ...props
                                     }) => {
    const [currentValue, setValue] = useState(String(value || ''));
    const [timer, setTimer] = useState(0);
    useEffect(() => {
        setValue(String(value));
        return () => window.clearTimeout(timer);
    }, [value]);


    const delayedChangeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timer);
        setValue(ev.target.value);
        const _timer = window.setTimeout(() => {
            changeHandler(ev);
        }, 350);
        setTimer(_timer);
    }

    const changeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timer);
        setValue(ev.target.value);
        if (String(value) !== ev.target.value) {
            onChange(ev.target.value);
        }
    }

    return (
        <input type={type} className="form-control form-control-sm" value={currentValue} {...props}
               onChange={delayedChangeHandler} onBlur={changeHandler}/>
    )
}

// export default memo(Input);
export default Input;
