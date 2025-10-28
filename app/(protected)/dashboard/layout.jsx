"use client";
import { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('Profile', '1', <i style={{fontSize:'17px'}} className="fi fi-rr-user"></i>),
    // getItem('Option 2', '2', <i className="fi fi-rr-desktop"></i>),
    // getItem('User', 'sub1', <UserOutlined />, [
    //     getItem('Tom', '3'),
    //     getItem('Bill', '4'),
    //     getItem('Alex', '5'),
    // ]),
    // getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    // getItem('Files', '9', <FileOutlined />),
];

export default function layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <div style={{}}>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={value => setCollapsed(value)}
                    breakpoint="md"
                    collapsedWidth={0}
                    onBreakpoint={(broken) => setCollapsed(broken)}
                    trigger={null}
                >
                    <div className="demo-logo-vertical" />
                    <Menu style={{fontSize:'17px', marginTop:'16px'}} theme="dark" defaultSelectedKeys={['1']} mode="inline"
                        items={items} />
                </Sider>
                <Layout>
                    <Header style={{ padding: '0 ', background: colorBgContainer, display: 'flex', alignItems: 'center' }}>
                        {/* <button
                            aria-label={collapsed ? 'Open menu' : 'Close menu'}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                border: '0px solid #e5e7eb',
                                background: '#ffffff',
                                borderRadius: 8,
                                padding: '0px 1px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer'
                            }}
                        >
                            {collapsed ? (
                                <i className="fi fi-bs-menu-burger" />
                            ) : (
                                <i className="fi fi-bs-cross" />
                            )}
                            <span style={{ fontWeight: 600, fontSize: 14 }}></span>
                        </button> */}
                        <Button
                            type="text"
                            // icon={collapsed ? <i className="fi fi-bs-menu-burger" /> :  <i className="fi fi-bs-cross" />}
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '20px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        {/* <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'User' }, { title: 'Bill' }]} /> */}
                        <div
                            style={{
                                padding: 24,
                                marginTop: 16,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                overflow: 'auto',
                            }}
                        >
                            {children}

                        </div>
                    </Content>
                    {/* <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer> */}
                </Layout>
            </Layout>

        </div>
    )
}
