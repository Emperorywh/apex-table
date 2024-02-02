import { Button } from "antd";
import React from "react";
import "./index.less";

/**
 * 首页
 * @returns 
 */
const Index: React.FC = () => {
    return <div className="index-container">
        <div className="title-word">ApexTable 1.0</div>
        <div className="desription">干翻友商的「Ant Design Pro 可编辑表格」 </div>
        <div className="header-card"></div>
        <div className="code-link">
            <Button type="link" onClick={() => {
                window.open('https://github.com/Emperorywh/apex-table', '_blank');
            }}>https://github.com/Emperorywh/apex-table</Button>
        </div>

    </div>
}

export default Index;