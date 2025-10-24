import React from 'react'
import styles from './ModulesSection.module.css';

const modules = [
    {
        title: 'SQL Basics',
        desc:
            'Learn the fundamental concepts of SQL and start writing your first queries.',
        icon: (
            <i className={`${styles.iconStyle} fi fi-rr-database`}></i>

        )
    },
    {
        title: 'Filtering and Sorting Data',
        desc:
            'Discover how to use WHERE and ORDER BY clauses to refine your data.',
        icon: (
            <i className={`${styles.iconStyle} fi fi-rr-filter`}></i>
        )
    },
    {
        title: 'Joins and Subqueries',
        desc:
            'Combine data from multiple tables and use nested queries for complex analysis.',
        icon: (
            <i className={`${styles.iconStyle} fi fi-rs-chart-set-theory`}></i>
        )
    },
    {
        title: 'Creating and Managing Views',
        desc:
            'Simplify complex queries and control data access with SQL views.',
        icon: (
            <i className={`${styles.iconStyle} fi fi-br-table-list`}></i>
        )
    },
    {
        title: 'Advanced SQL',
        desc:
            'Automate tasks and enforce data integrity with triggers and stored procedures.',
        icon: (
            <i className={`${styles.iconStyle} fi fi-br-bolt`}></i>
        )
    }
];

function IconBadge({ children }) {
    return <span className={styles.iconBadge} aria-hidden="true">
        {children}
    </span>;
}

export default function ModulesSection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Our Modules</h2>
            <div className={styles.grid}>
                {modules.map((m, idx) => (
                    <article key={idx} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <IconBadge>{m.icon}</IconBadge>
                            <h3 className={styles.cardTitle}>{m.title}</h3>
                        </div>
                        <p className={styles.cardDesc}>{m.desc}</p>
                    </article>
                ))}
                    {/* See More card aligned with the grid */}
                    <a href="/modules" className={styles.seeMoreCard} aria-label="See more modules">
                        <span>See More</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 12h14" stroke="#0284c7" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M13 6l6 6-6 6" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
            </div>
        </section>
    )
}
