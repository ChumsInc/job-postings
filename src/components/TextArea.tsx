import React, {memo, useEffect, useState} from "react";
import TextAreaAutosize from 'react-autosize-textarea';

interface TextAreaProps extends React.TextareaHTMLAttributes<any> {
    onChange: (any: any) => any,
}

const TextArea: React.FC<TextAreaProps> = ({value, children, onChange, ...props}) => {
    const [timer, setTimer] = useState(0);
    const [currentValue, setValue] = useState(value || '');
    useEffect(() => {
        setValue(value || '');
        return () => window.clearTimeout(timer);
    }, [value]);

    const delayedChangeHandler = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        clearTimeout(timer);
        setValue(ev.target.value);
        const _timer = window.setTimeout(() => {
            onChange(ev.target.value);
        }, 350);
        setTimer(_timer);
    }

    const changeHandler = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        clearTimeout(timer);
        setValue(ev.target.value);
        onChange(ev.target.value);
    }

    return (
        <TextAreaAutosize className="form-control form-control-sm" value={currentValue}
                          {...props}
                          rows={3} maxRows={12}
                          onChange={delayedChangeHandler} onBlur={changeHandler}/>
    )
}

export default memo(TextArea);
