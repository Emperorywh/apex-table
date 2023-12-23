import { Button } from "antd";
import React from "react";

/**
 * 首页
 * @returns 
 */
const Index: React.FC = () => {
    return <>
        <Button type="link" onClick={() => {
            window.open('https://github.com/Emperorywh/apex-table', '_blank');
        }}>源码地址</Button>
    </>
}

export default Index;