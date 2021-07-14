import React from "react";

interface FormRowProps {
    width?: number,
    label?: string|React.ReactNode
}
const FormRow:React.FC<FormRowProps> = ({width= 9, label, children}) => {
    return (
        <div className="row g-3 mb-3">
            <label className={`col-${12 - (width % 12)}`}>{label}</label>
            <div className={`col-${width % 12}`}>
                {children}
            </div>
        </div>
    )
}
export default FormRow;
