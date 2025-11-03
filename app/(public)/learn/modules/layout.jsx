"use client"
import React, { useState, useEffect, useRef } from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import styles from './layout.module.css';
import { Button, Layout, Menu, theme, Spin, Grid } from 'antd';
import { createClient } from '@/lib/supabaseBrowser';
import LoadingIcon from '@/components/ui/LoadingIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
const { useBreakpoint } = Grid;


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
    const screens = useBreakpoint(); // gives: { xs, sm, md, lg, xl, xxl }
    const isMobile = !screens.md; // true for <768px
    // console.log("isMobile", isMobile);
    

    const supabase = createClient();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    // touch tracking for swipe gestures
    const touchStartXRef = useRef(0);
    const touchStartYRef = useRef(0);
    const handledRef = useRef(false);

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

    // Handlers: swipe left on Sider to hide; swipe right from edge on Content to show
    const onSiderTouchStart = (e) => {
        if (!isMobile) return;
        const t = e.touches?.[0];
        if (!t) return;
        touchStartXRef.current = t.clientX;
        touchStartYRef.current = t.clientY;
        handledRef.current = false;
    };

    const onSiderTouchMove = (e) => {
        if (!isMobile || handledRef.current) return;
        const t = e.touches?.[0];
        if (!t) return;
        const dx = t.clientX - touchStartXRef.current; // negative when moving left
        const dy = t.clientY - touchStartYRef.current;
        // Ensure primarily horizontal swipe left
        if (Math.abs(dx) > Math.max(40, Math.abs(dy) * 1.5) && dx < -50) {
            if (!collapsed) setCollapsed(true);
            handledRef.current = true;
        }
    };

    const onSiderTouchEnd = () => {
        handledRef.current = false;
    };

    const onContentTouchStart = (e) => {
        if (!isMobile) return;
        const t = e.touches?.[0];
        if (!t) return;
        touchStartXRef.current = t.clientX;
        touchStartYRef.current = t.clientY;
        handledRef.current = false;
    };

    const onContentTouchMove = (e) => {
        if (!isMobile || handledRef.current) return;
        const t = e.touches?.[0];
        if (!t) return;
        const dx = t.clientX - touchStartXRef.current; // positive when moving right
        const dy = t.clientY - touchStartYRef.current;
        // Only consider a swipe-right that started near left edge when sidebar is collapsed
        const startedAtEdge = touchStartXRef.current <= 24; // 24px edge zone
        if (collapsed && startedAtEdge && Math.abs(dx) > Math.max(40, Math.abs(dy) * 1.5) && dx > 50) {
            setCollapsed(false);
            handledRef.current = true;
        }
    };

    const onContentTouchEnd = () => {
        handledRef.current = false;
    };

    return (
        <div>
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
                    onTouchStart={onSiderTouchStart}
                    onTouchMove={onSiderTouchMove}
                    onTouchEnd={onSiderTouchEnd}
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
                            // Added onClick to collapse menu on mobile after selection
                            onClick={isMobile ? () => setCollapsed(true) : undefined}
                        />
                    )}
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => {setCollapsed(!collapsed)
                            }}
                            style={{
                                fontSize: '23px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header>
                    <Content
                        style={{ margin: '24px 16px 0', overflow: 'initial' }}
                        onTouchStart={onContentTouchStart}
                        onTouchMove={onContentTouchMove}
                        onTouchEnd={onContentTouchEnd}
                    >
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
