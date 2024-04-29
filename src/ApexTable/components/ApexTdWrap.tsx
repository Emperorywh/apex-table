import React from "react";
import { ApexTableProps, IApexTableColumns } from "..";


export interface IApexTdWrap {
    id?: string;
    apexTableProps: ApexTableProps<any>;
    apexColumn: IApexTableColumns<any>
    children?: React.ReactNode
}

/**
 * 包装td
 * @param props 
 * @returns 
 */
const ApexTdWrap: React.FC<IApexTdWrap> = (props) => {
    const { apexTableProps, apexColumn, id } = props;
    const { allowFixed } = apexTableProps;
    return <td id={id} className={`apex-table-tbody-td ${allowFixed && apexColumn.fixed ? 'apex-table-tbody-fixed-' + apexColumn.fixed : ''}`}>
        {props.children}
    </td>
};

export default ApexTdWrap;