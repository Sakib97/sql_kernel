"use client"
import React, { useState, useEffect } from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import styles from './layout.module.css';
import { Button, Layout, Menu, theme, Spin } from 'antd';
import { createClient } from '@/lib/supabaseBrowser';
import LoadingIcon from '@/components/ui/LoadingIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';


const { Header, Content, Footer, Sider } = Layout;
const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    transition: 'all .3s',
    width: 280,
};
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

export default function ModuleLayout({ children }) {
    const supabase = createClient();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // const [modules, setModules] = useState([]);
    // const [loading, setLoading] = useState(true);

    const [selectedKey, setSelectedKey] = useState(null);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Fetch function
    const fetchModules = async () => {
        const { data, error } = await supabase
            .from('modules')
            .select('id, title_en, order_index, module_slug')
            .eq('is_published', true)
            .order('order_index', { ascending: true })

        if (error) {
            console.error('Error fetching modules:', error)
            throw error
        }

        return data || []
    }

    // Use React Query for caching
    const { data: modules = [], isLoading: loading } = useQuery({
        queryKey: ['modules'],
        queryFn: fetchModules,
        // staleTime: 5 * 60 * 1000, // overrides global
        // cacheTime: 10 * 60 * 1000, // overrides global
    })

    // useEffect(() => {
    //     // Fetch modules from Supabase
    //     const fetchModules = async () => {
    //         try {
    //             const { data, error } = await supabase
    //                 .from('modules')
    //                 .select('id, title_en, order_index, module_slug')
    //                 .eq('is_published', true)
    //                 .order('order_index', { ascending: true });

    //             if (error) {
    //                 console.error('Error fetching modules:', error);
    //                 setModules([]);
    //             } else {
    //                 setModules(data || []);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching modules:', error);
    //             setModules([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchModules();
    // }, []);

    // Update selected key based on pathname
    useEffect(() => {
        if (modules.length > 0 && pathname) {
            // Extract module slug from pathname (e.g., /learn/modules/intro-to-sql)
            const pathParts = pathname.split('/');
            const moduleSlugFromPath = pathParts[3]; // modules is at index 2, slug at index 3

            // Find the module that matches the current path
            const currentModule = modules.find(m => m.module_slug === moduleSlugFromPath);

            if (currentModule) {
                setSelectedKey(currentModule.id.toString());
            } else {
                // No module selected (e.g., on /learn/modules page)
                setSelectedKey(null);
            }
        }
    }, [pathname, modules]);

    // Generate menu items from fetched modules
    const items = modules.map((module, index) =>
        getItem(
            <Link href={`/learn/modules/${module.module_slug}`}>
                <div className={styles.menuItemLabel}>
                    <span className={styles.moduleIndex}>Module {index + 1}:</span>
                    <span className={styles.moduleTitle} title={module.title_en}>{module.title_en}</span>
                </div>
            </Link>,
            module.id.toString(),
            <i style={{ fontSize: '23px' }} className="fi fi-rr-module"></i>
        )
    );

    return (
        <div>
            {/* <h1>Layout</h1> */}
            <Layout hasSider>
                <Sider style={siderStyle}
                    className={styles.sider}
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={value => setCollapsed(value)}
                    breakpoint="md"
                    collapsedWidth={0}
                    onBreakpoint={(broken) => setCollapsed(broken)}
                    width={260}
                >
                    <Link href="/learn/modules">
                        <div className={styles.siderHeader}>
                            <span className={styles.siderTitle}>Modules</span>
                            {!loading && modules?.length > 0 && (
                                <span className={styles.siderCount}>{modules.length}</span>
                            )}
                        </div>
                    </Link>
                    {loading ? (
                        <div className={styles.loadingWrap}>
                            {/* <Spin size="small" />
                            <span className={styles.loadingText}>Loading modules…</span> */}
                            <LoadingIcon text="Loading modules..." />
                        </div>
                    ) : (
                        <Menu
                            className={styles.menu}
                            style={{ fontSize: '16px' }}
                            theme="dark"
                            selectedKeys={selectedKey ? [selectedKey] : []}
                            mode="inline"
                            items={items}
                            inlineIndent={12}
                        />
                    )}
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '23px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header>
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                        <div
                            style={{
                                padding: 24,
                                // textAlign: 'center',
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                overflow: 'auto',

                            }}
                        >
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}
