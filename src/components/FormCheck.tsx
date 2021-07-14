import React, {memo} from "react";
import classNames from "classnames";

interface FormCheckProps {
    type?: 'checkbox'|'radio',
    checked: boolean,
    inline?: boolean,
    label?: string,
    children?:React.Component|string,
    onChange: (checked:boolean) => any,
}

const FormCheck:React.FC<FormCheckProps> = ({type = 'checkbox', checked= false, inline = false, label = false, onChange, children}) => {
    const changeHandler = (ev:React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.checked);
    return (
        <div className={classNames('form-check', {'form-check-inline': inline})}>
            <input type={type} className="form-check-input" onChange={changeHandler} checked={checked} />
            <label onClick={() => onChange(type === 'radio' ? true : !checked)}>{label||children}</label>
        </div>
    )
}

export default memo(FormCheck);
