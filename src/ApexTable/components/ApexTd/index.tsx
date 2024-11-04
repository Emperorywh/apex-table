import React, { forwardRef, useEffect, useState } from "react";
import { IProps } from "./index.types";
import { handleSetFixedPosition } from "apex-table/ApexTable/utils/tools";
import { flushSync } from 'react-dom';
function ApexTd(props: IProps<any>, ref: React.Ref<HTMLTableDataCellElement>) {
    const {
        row,
        rowHeight,
        children,
        column,
        columns,
        allowFixed,
        allowSelect,
        showLineNumber,
        isValid
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
            const filterColumns = columns.filter(item => item?.fixed === 'left');
            if (filterColumns.length > 0) {
                const lastLeft = filterColumns.pop();
                if (lastLeft?.name === column.name) {
                    className = className.concat(` apex-table-fixed-${fixed}-last`);
                }
            }
            const firstColumn = columns.find(item => item?.fixed === 'right');
            if (firstColumn && firstColumn.name === column.name) {
                className = className.concat(` apex-table-fixed-${fixed}-last`);
            }
        }
        if (!isValid && isValid !== undefined) {
            className = className.concat(' apex-table-tbody-td-verify-failed')
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
        Promise.resolve().then(() => {
            flushSync(() => {
                initClassNames();
                initStyles();
            })
        })
    }, [columns, isValid]);


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