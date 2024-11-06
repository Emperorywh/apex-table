import React, { useEffect, useState } from "react";
import { IProps } from 'apex-table/ApexTable/components/ApexColumnConfig/components/DraggableColumn/index.types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities';
import { IApexTableColumns } from 'apex-table/ApexTable/index.types'
import { DragOutlined } from '@ant-design/icons'
import { Checkbox } from 'antd'
import "./index.less";

/**
 * 可拖动 行
 * @constructor
 */
const DraggableColumn = (props: IProps<any>) => {
    
    const { id, columns } = props;
    
    const [column, setColumn] = useState<IApexTableColumns<any> | null>(null);
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab'
    };
    
    const init = () => {
        const findColumn = columns.find(item => item.name === id);
        if (findColumn) {
            setColumn(findColumn)
        }
    }
    
    useEffect(() => {
        init();
    }, [])
    
    
    return (column &&
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className="drag-row">
                <DragOutlined style={{ fontSize: 18 }}/>
                <div className="drag-content">
                    <Checkbox checked={column.visible} onChange={event => {
                        console.log(event.target.checked)
                    }}>{column.title}</Checkbox>
                </div>
            </div>
        </div>
    );
}

export default DraggableColumn;