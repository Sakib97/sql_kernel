"use client"
import React from 'react'
import styles from './page.module.css'
import { BookOutlined, TrophyOutlined, RocketOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons'

export default function ModulesPage() {
  const skills = [
    "SQL Fundamentals",
    "Database Design",
    "Query Optimization",
    "Data Analysis",
    "Transaction Management",
    "Advanced Joins",
    "Stored Procedures",
    "Performance Tuning"
  ];

  const outcomes = [
    "Write complex SQL queries with confidence",
    "Design and normalize relational databases",
    "Optimize query performance for large datasets",
    "Understand and implement database security",
    "Master joins, subqueries, and window functions",
    "Build real-world database applications"
  ];

  const courseContents = [
    {
      module: "Module 1",
      title: "Introduction to SQL",
      lessons: 8,
      duration: "2 hours"
    },
    {
      module: "Module 2",
      title: "Data Manipulation",
      lessons: 12,
      duration: "3 hours"
    },
    {
      module: "Module 3",
      title: "Advanced Queries",
      lessons: 10,
      duration: "2.5 hours"
    },
    {
      module: "Module 4",
      title: "Database Design",
      lessons: 9,
      duration: "2 hours"
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroIcon}>
          <BookOutlined />
        </div>
        <h1 className={styles.heroTitle}>Master SQL Database</h1>
        <p className={styles.heroSubtitle}>
          Learn SQL from fundamentals to advanced concepts. Build real-world database applications 
          and master the most in-demand data skill.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <ClockCircleOutlined className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>10+ hours</span>
              <span className={styles.statLabel}>Course Duration</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <BookOutlined className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>40+ lessons</span>
              <span className={styles.statLabel}>Total Lessons</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <UserOutlined className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>Beginner</span>
              <span className={styles.statLabel}>Level</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Overview */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <RocketOutlined className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Course Overview</h2>
        </div>
        <p className={styles.overview}>
          This comprehensive SQL course takes you from absolute beginner to confident database professional. 
          You'll learn how to write efficient queries, design scalable databases, and analyze data like a pro. 
          With hands-on exercises and real-world projects, you'll gain practical experience that employers value.
        </p>
      </div>

      {/* Skills Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <TrophyOutlined className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Skills You'll Gain</h2>
        </div>
        <div className={styles.skillsGrid}>
          {skills.map((skill, index) => (
            <div key={index} className={styles.skillTag}>
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <CheckCircleOutlined className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>What You'll Learn</h2>
        </div>
        <div className={styles.outcomesList}>
          {outcomes.map((outcome, index) => (
            <div key={index} className={styles.outcomeItem}>
              <CheckCircleOutlined className={styles.outcomeIcon} />
              <span className={styles.outcomeText}>{outcome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Contents */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <BookOutlined className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Course Contents</h2>
        </div>
        <div className={styles.contentsList}>
          {courseContents.map((content, index) => (
            <div key={index} className={styles.contentCard}>
              <div className={styles.contentHeader}>
                <span className={styles.moduleLabel}>{content.module}</span>
                <span className={styles.contentDuration}>
                  <ClockCircleOutlined /> {content.duration}
                </span>
              </div>
              <h3 className={styles.contentTitle}>{content.title}</h3>
              <div className={styles.contentFooter}>
                <span className={styles.lessonCount}>
                  <BookOutlined /> {content.lessons} lessons
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Start Your SQL Journey?</h2>
        <p className={styles.ctaText}>
          Select a module from the sidebar to begin learning. Each lesson builds on the previous one, 
          so we recommend starting from Module 1 if you're new to SQL.
        </p>
      </div>
    </div>
  )
}
