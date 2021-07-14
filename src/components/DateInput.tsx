import React, {useEffect, useState} from "react";
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

declare type DateInputType = 'date'|'datetime-local'|'time';

interface DateInputProps extends React.InputHTMLAttributes<any> {
    type?: DateInputType,
    value?: string|number,
    onChange: (any: any) => void,
}

const dateValue = (date:string|number|Date|null, type: DateInputType = 'date'):string => {
    if (!date || !new Date(date).getTime()) {
        return '';
    }
    let d = new Date(typeof date === 'string' ? parseISO(date) : date);

    switch (type) {
    case 'time':
        return format(d, 'HH:mm');
    case 'datetime-local':
        return format(d, "yyyy-MM-dd'T'HH:mm");
    case 'date':
    default:
        return format(d, 'yyyy-MM-dd');
    }
}

const DateInput: React.FC<DateInputProps> = ({
                                         type = 'date',
                                         value = '',
                                         children,
                                         onChange,
                                         ...props
                                     }) => {
    const [currentValue, setValue] = useState(value || '');
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
        <input type={type} className="form-control form-control-sm" value={dateValue(currentValue, type)} {...props}
               onChange={delayedChangeHandler} onBlur={changeHandler}/>
    )
}

// export default memo(Input);
export default DateInput;
