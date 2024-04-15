import React from "react";

interface IProps {
    children: React.ReactNode;
    onClick?: () => void;
}

/**
 * 单元格展示的组件
 * @param props 
 * @returns 
 */
const ApexShowCell: React.FC<IProps> = (props) => {
    return <div className="apex-show-cell" onClick={props.onClick}>
        {props.children}
    </div>
}

export default ApexShowCell;