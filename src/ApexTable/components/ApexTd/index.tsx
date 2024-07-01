import React, { forwardRef } from "react";
import { IProps } from "./index.types";

function ApexTd(props: IProps, ref: React.Ref<HTMLTableDataCellElement>) {
    const { rowHeight, children } = props;
    return <td className={`apex-table-tbody-td`} style={{ height: rowHeight }} ref={ref}>
        {children}
    </td>
}

export default forwardRef(ApexTd);