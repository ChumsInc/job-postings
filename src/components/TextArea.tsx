import React, {useEffect, useState} from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<any> {
    onChange: (any: any) => void,
}

const TextArea: React.FC<TextAreaProps> = ({
                                         value = '',
                                        rows = 3,
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


    const delayedChangeHandler = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        clearTimeout(timer);
        setValue(ev.target.value);
        const _timer = window.setTimeout(() => {
            changeHandler(ev);
        }, 350);
        setTimer(_timer);
    }

    const changeHandler = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        clearTimeout(timer);
        setValue(ev.target.value);
        if (String(value) !== ev.target.value) {
            onChange(ev.target.value);
        }
    }

    return (
        <textarea className="form-control form-control-sm" value={currentValue} rows={rows} {...props}
               onChange={delayedChangeHandler} onBlur={changeHandler}/>
    )
}

export default TextArea;
