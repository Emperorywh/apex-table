import React, { useEffect, useState } from "react";
import { IProps } from './index.types';
import { Button, Checkbox, Modal, Popconfirm } from "antd";
import ApexTh from "../ApexTh";
import { SettingOutlined } from '@ant-design/icons'
import ApexColumnConfig from 'apex-table/ApexTable/components/ApexColumnConfig'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core/dist/types'
import { IApexTableColumns } from 'apex-table/ApexTable/index.types'

function ApexThead<T>(props: IProps<T>) {
    const {
        columns,
        originColumns,
        showLineNumber = false,
        showColumnConfig = false,
        allowSelect = false,
        allowResize = false,
        allowFixed = false,
        allowSort = false,
        allowColumnDrag = false,
        showHeaderCheckBox = false,
        isSingle = false,
        headerChecked = false,
        indeterminate = false,
        rowHeight,
        onHeaderCheckBoxChange,
        onColWidthChange,
        onChangeColumns,
        onColumnSort
    } = props;
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState<string[]>([]);
    const [dragKey, setDragKey] = useState<any>('');
    const [maxLevel, setMaxLevel] = useState(0);
    const [multiLevelColumns, setMultiLevelColumns] = useState<any[]>([]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setDragKey('');
        if (active && over && active.id !== over.id) {
            const oldIndex = items.indexOf(active.id as any);
            const newIndex = items.indexOf(over.id as any);
            const newDragKeys = arrayMove(items, oldIndex, newIndex);
            setItems(newDragKeys);
            const newDataSource: any[] = [];
            newDragKeys.forEach(item => {
                const findData = columns.find(dataItem => dataItem.name === item);
                if (findData) {
                    newDataSource.push(findData);
                }
            });
            onChangeColumns(newDataSource);
        }
    }
    
    const handleDragStart = (event: DragEndEvent) => {
        const { active } = event;
        setDragKey(active.id);
    }
    
    /**
     * 初始化列
     */
    const initColumns = () => {
        setItems(columns.map(item => item.name));
    }
    
    /**
     *  点击列配置
     */
    const handleColumnConfig = () => {
        setIsModalOpen(true)
    }
    
    /**
     * 获取最大树高
     * @param column
     */
    const getMaxTreeHeight = (column: IApexTableColumns<T>) => {
        if (!column) return 0;  // 如果节点为空，返回0高度
        if (!column.children || column.children.length === 0) return 1;  // 如果没有子节点，说明是叶子节点，返回1
        
        // 递归计算每个子节点的最大树高，然后取最大值
        let maxHeight = 0;
        for (let child of column.children) {
            maxHeight = Math.max(maxHeight, getMaxTreeHeight(child));
        }
        
        return maxHeight + 1;  // 加1是因为当前节点也是树高的一部分
    }
    
    /**
     * 格式化多级表头数据结构
     * @param columns
     * @param maxLevel
     */
    const onFormatMultiLevelColumns = (columns: IApexTableColumns<T>[], maxLevel = 0, result: any[] = [], level = 0) => {
        if (columns.length === 0) return;
        
        columns.forEach((column, index) => {
            if (!result[level]) {
                result[level] = [];
            }
            // 如果列有子列（即为父级列）
            if (column?.children && column.children.length > 0) {
                column.colSpan = onGetMaxChildren(column?.children, 0);    // 设置 colSpan
                result[level].push(column);                 // 将父列添加到当前层级
                onFormatMultiLevelColumns(column.children, maxLevel, result, level + 1); // 递归处理子列
            } else {
                // 如果列没有子列（即为叶子列）
                column.rowSpan = maxLevel - level; // 设置 rowSpan
                result[level] = result[level] || []; // 确保当前索引位置已初始化
                result[level].push(column); // 将列添加到 result 的对应位置
            }
        });
    }
    
    /**
     * 获取最大子节点数量
     * @param columns
     * @param count
     */
    const onGetMaxChildren = (columns: IApexTableColumns<T>[], count = 0) => {
        let result = count;
        columns.forEach((column, index) => {
            if (column?.children && column.children.length > 0) {
                result = onGetMaxChildren(column?.children, result);
            } else {
                result += 1;
            }
        });
        return result;
    }
    
    /**
     * 获取最大树高
     */
    const onSetMaxLevel = () => {
        let level = 0;
        columns.forEach(item => {
            level = Math.max(level, getMaxTreeHeight(item));
        });
        setMaxLevel(level);
        const result: any[] = [];
        onFormatMultiLevelColumns(columns, level, result);
        setMultiLevelColumns(result);
    }
    
    
    useEffect(() => {
        initColumns();
        onSetMaxLevel();
    }, [columns])
    
    
    return <thead className='apex-table-thead'>
    {
        maxLevel < 2 && <tr style={{ height: rowHeight }}>
            {
                showLineNumber ? <th className='apex-table-thead-th apex-table-thead-th-line-number-head'>
                    {
                        showColumnConfig ? <SettingOutlined
                            style={{ fontSize: 18, cursor: 'pointer' }}
                            onClick={handleColumnConfig}
                        /> : <div>行号</div>
                    }
                
                </th> : null
            }
            {
                allowSelect && <th className='apex-table-thead-th apex-table-thead-th-checkbox'>
                    {
                        showHeaderCheckBox &&
                        <Checkbox disabled={isSingle} checked={headerChecked} indeterminate={indeterminate}
                                  onChange={onHeaderCheckBoxChange}/>
                    }
                </th>
            }
            {
                allowColumnDrag ? <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                >
                    <SortableContext
                        items={items}
                        strategy={horizontalListSortingStrategy}
                    >
                        {
                            items.map((item, index) => {
                                const findColumn = columns.find(fItem => fItem.name === item);
                                if (!findColumn) return null;
                                if (findColumn?.visible === false) {
                                    return null
                                } else {
                                    return <ApexTh
                                        dragKey={dragKey}
                                        allowSelect={allowSelect}
                                        allowFixed={allowFixed}
                                        allowResize={allowResize}
                                        allowColumnDrag={allowColumnDrag}
                                        allowSort={allowSort}
                                        key={`${String(findColumn.name)}-${index}`}
                                        column={findColumn}
                                        columns={columns}
                                        rowHeight={rowHeight}
                                        showLineNumber={showLineNumber}
                                        onColWidthChange={onColWidthChange}
                                        onColumnSort={onColumnSort}
                                    />
                                }
                            })
                        }
                    </SortableContext>
                </DndContext> : columns.map((column, index) => {
                    if (column?.visible === false) {
                        return null
                    } else {
                        return <ApexTh
                            dragKey={dragKey}
                            allowSelect={allowSelect}
                            allowFixed={allowFixed}
                            allowResize={allowResize}
                            allowColumnDrag={allowColumnDrag}
                            allowSort={allowSort}
                            key={`${String(column.name)}-${index}`}
                            column={column}
                            columns={columns}
                            rowHeight={rowHeight}
                            showLineNumber={showLineNumber}
                            onColWidthChange={onColWidthChange}
                            onColumnSort={onColumnSort}
                            rowSpan={column.rowSpan}
                            colSpan={column.colSpan}
                        />
                    }
                })
            }
        </tr>
    }
    
    {
        maxLevel >= 2 && multiLevelColumns.map((columns: IApexTableColumns<T>[], index) => {
            return <tr style={{ height: rowHeight }} key={index}>
                {
                    showLineNumber && index === 0 ? <th rowSpan={maxLevel} className='apex-table-thead-th apex-table-thead-th-line-number-head'>
                        {
                            showColumnConfig ? <SettingOutlined
                                style={{ fontSize: 18, cursor: 'pointer' }}
                                onClick={handleColumnConfig}
                            /> : <div>行号</div>
                        }
        
                    </th> : null
                }
                {
                    allowSelect && index === 0 && <th rowSpan={maxLevel}  className='apex-table-thead-th apex-table-thead-th-checkbox'>
                        {
                            showHeaderCheckBox &&
                            <Checkbox disabled={isSingle} checked={headerChecked} indeterminate={indeterminate}
                                      onChange={onHeaderCheckBoxChange}/>
                        }
                    </th>
                }
                {
                    columns.map((column, columnIndex) => {
                        if (column?.visible === false) {
                            return null
                        } else {
                            return <ApexTh
                                dragKey={dragKey}
                                allowSelect={allowSelect}
                                allowFixed={allowFixed}
                                allowResize={allowResize}
                                allowColumnDrag={allowColumnDrag}
                                allowSort={allowSort}
                                key={`${String(column.name)}-${columnIndex}`}
                                column={column}
                                columns={columns}
                                rowHeight={rowHeight}
                                showLineNumber={showLineNumber}
                                onColWidthChange={onColWidthChange}
                                onColumnSort={onColumnSort}
                                rowSpan={column.rowSpan}
                                colSpan={column.colSpan}
                            />
                        }
                    })
                }
            </tr>
        })
    }
    
    <Modal
        title={
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 10px'
            }}>
                <div style={{
                    fontSize: 14,
                    color: 'rgba(42, 46, 54, 0.88)',
                }}>列配置
                </div>
                <Popconfirm
                    title="提示"
                    description="确定要恢复到初始设置吗？"
                    onConfirm={() => {
                        onChangeColumns(originColumns);
                        setIsModalOpen(false);
                    }}
                    okText="确定"
                    cancelText="取消"
                    placement="bottom"
                >
                    <Button type="link" style={{
                        fontWeight: '700'
                    }}>重置</Button>
                </Popconfirm>
            </div>
        }
        centered
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
    >
        <ApexColumnConfig
            columns={columns}
            onCancel={() => setIsModalOpen(false)}
            onOk={(columns) => {
                onChangeColumns(columns);
                setIsModalOpen(false);
            }}
        />
    </Modal>
    </thead>
}

export default ApexThead;