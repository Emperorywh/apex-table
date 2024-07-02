import React, { forwardRef, useEffect, useState } from "react";
import { IProps } from "./index.types";
import { handleSetFixedPosition } from "apex-table/ApexTable/utils/tools";

function ApexTd(props: IProps<any>, ref: React.Ref<HTMLTableDataCellElement>) {
    const {
        row,
        rowHeight,
        children,
        column,
        columns,
        allowFixed,
        allowSelect,
        showLineNumber
    } = props;
    const { fixed } = column;
    const [classNames, setClassNames] = useState('');
    const [styles, setStyles] = useState<any>();
    /**
     * 初始化类名
     */
    const initClassNames = () => {
        let className = 'apex-table-tbody-td';
        if (allowFixed && fixed) {
            className = className.concat(` apex-table-tbody-td-fixed apex-table-tbody-td-fixed-${fixed}`);
        }
        setClassNames(className);
    }

    /**
     * 初始化样式
     */
    const initStyles = () => {
        const style: any = {
            height: rowHeight
        }
        const newSyle = handleSetFixedPosition({
            styles: style,
            column,
            columns,
            fixed,
            allowSelect,
            showLineNumber
        });
        setStyles(newSyle);
    }

    useEffect(() => {
        initClassNames();
        initStyles();
    }, [columns]);


    return <td
        className={classNames}
        style={styles}
        ref={ref}
        id={`td-${row.rowIndex}-${column.name}`}
    >
        {children}
    </td>
}

export default forwardRef(ApexTd);