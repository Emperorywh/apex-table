import React from "react";
import ApexShowCellChildren from "../ApexShowCellChildren";
import { IApexTableColumns } from "apex-table/ApexTable/index.types";

interface IProps {
    column: IApexTableColumns<any>;
    row: any;
    onClick: () => void;
}

/**
 * 单元格展示的组件
 * @param props 
 * @returns 
 */
const ApexShowCell: React.FC<IProps> = (props) => {
    const { column, row } = props;
    const { name, onRender } = column;
    return <div className="apex-show-cell" onClick={props.onClick}>
        <div className="overflow-hidden-one">
            {onRender ? onRender(row, row[name]) : <ApexShowCellChildren columnItem={column} dataSourceItem={row} />}
        </div>
    </div>
}

export default ApexShowCell;