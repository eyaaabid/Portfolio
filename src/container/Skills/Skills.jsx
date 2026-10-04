import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';
import './Skills.scss';

// The Sanity data has no "type" field, so it is guessed from the role/company text.
// Delete this helper (and the tag span in the JSX) if you'd rather not show it.
const getWorkType = ({ name = '', company = '' }) => {
  if (/intern|stage|stagiaire/i.test(name)) return 'Internship';
  if (/freelanc/i.test(name) || /freelanc/i.test(company)) return 'Freelance';
  return 'Full-time';
};

// Sanity "date" fields arrive as "YYYY-MM-DD". Parsed by hand to avoid timezone shifts.
const parseMonth = (value) => {
  if (!value) return null;
  const [y, m] = value.split('-').map(Number);
  return new Date(y, (m || 1) - 1, 1);
};

const formatMonth = (value) => {
  const date = parseMonth(value);
  return date ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
};

// "1 yr 2 mos", "8 mos"... counts both the start and end month. No end date = still ongoing.
const getDuration = (start, end) => {
  const s = parseMonth(start);
  if (!s) return '';
  const e = end ? parseMonth(end) : new Date();
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1;
  if (months < 1) return '';
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [
    years ? `${years} yr${years > 1 ? 's' : ''}` : '',
    rest ? `${rest} mo${rest > 1 ? 's' : ''}` : '',
  ].filter(Boolean).join(' ');
};

// Newest start date first when both roles have one; otherwise keeps the order set in Sanity
const sortWorks = (works = []) =>
  [...works].sort((a, b) =>
    a.startDate && b.startDate ? parseMonth(b.startDate) - parseMonth(a.startDate) : 0);

// Descriptions are written as one string with "•" between points (the Studio "string" field is
// single-line). Split it so each point gets its own line. Text before the first "•" is an intro.
const parseDesc = (desc = '') => {
  if (!/[•●▪]/.test(desc)) return { intro: desc.trim(), items: [] };
  const [intro, ...items] = desc.split(/[•●▪]/).map((part) => part.trim());
  return { intro, items: items.filter(Boolean) };
};

const Chevron = () => (
  <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
    <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Skills = () => {
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [openId, setOpenId] = useState(null); // one role open at a time
  const expRef = useRef(null);

  useEffect(() => {
    const query = '*[_type == "experiences"]';
    const skillsQuery = '*[_type == "skills"]';

    client.fetch(query).then((data) => {
      setExperience(data);
    });

    client.fetch(skillsQuery).then((data) => {
      setSkills(data);
    });
  }, []);

  // Newest year first, whatever order Sanity returns them in
  const sortedExperience = [...experience].sort((a, b) => Number(b.year) - Number(a.year));

  // The timeline line fills as you scroll, and each dot lights up when the line reaches it.
  // Done with a plain scroll listener so it works with any framer-motion version.
  useEffect(() => {
    const el = expRef.current;
    if (!el) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = null;

    const update = () => {
      frame = null;
      const rect = el.getBoundingClientRect();
      const lead = window.innerHeight * 0.65; // line leads at 65% of the viewport height
      const progress = reduceMotion ? 1 : Math.min(1, Math.max(0, (lead - rect.top) / rect.height));
      const frontY = reduceMotion ? Infinity : rect.top + progress * rect.height;

      el.style.setProperty('--progress', progress);
      el.querySelectorAll('[data-dot]').forEach((dot) => {
        const r = dot.getBoundingClientRect();
        dot.classList.toggle('is-reached', r.top + r.height / 2 <= frontY);
      });
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [experience, openId]);

  return (
    <>
      <h2 className="head-text">Skills & Experience</h2>

      <div className="app__skills-container">
        <motion.div className="app__skills-list">
          {skills?.map((skill, index) => (
            <motion.div
              whileInView={{ opacity: [0, 1], y: [16, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="app__skills-item app__flex"
              key={skill.name}
            >
              <div className="app__skills-icon app__flex" style={{ backgroundColor: skill.bgColor }}>
                <img src={urlFor(skill.icon)} alt="" />
              </div>
              <p className="p-text">{skill.name}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="app__skills-exp" ref={expRef}>
          <span className="app__skills-exp-track" aria-hidden="true" />
          <span className="app__skills-exp-fill" aria-hidden="true" />

          {sortedExperience.map((exp) => (
            <section
              className="app__skills-exp-item"
              key={exp.year}
              aria-label={`Experience in ${exp.year}`}
            >
              <h3 className="app__skills-exp-year">{exp.year}</h3>

              <ul className="app__skills-exp-works">
                {sortWorks(exp.works).map((work, workIndex) => {
                  const id = `role-${exp.year}-${workIndex}`;
                  const type = getWorkType(work);
                  const hasDesc = Boolean(work.desc);
                  const start = formatMonth(work.startDate);
                  const end = work.endDate ? formatMonth(work.endDate) : 'Present';
                  const duration = getDuration(work.startDate, work.endDate);
                  const isCurrent = Boolean(work.startDate) && !work.endDate;
                  const { intro, items } = parseDesc(work.desc);
                  const isOpen = openId === id;
                  const Row = hasDesc ? 'button' : 'div';
                  const rowProps = hasDesc
                    ? {
                        type: 'button',
                        'aria-expanded': isOpen,
                        'aria-controls': `${id}-panel`,
                        onClick: () => setOpenId(isOpen ? null : id),
                      }
                    : {};

                  return (
                    <li
                      key={`${work.name}-${work.company}`}
                      className={`app__skills-exp-work ${isOpen ? 'is-open' : ''}`}
                    >
                      <span className="app__skills-exp-dot" data-dot aria-hidden="true" />

                      <Row className="app__skills-exp-row" {...rowProps}>
                        <span className="app__skills-exp-text">
                          <span className="app__skills-exp-role">{work.name}</span>
                          <span className="app__skills-exp-company">{work.company}</span>
                          {work.startDate && (
                            <span className="app__skills-exp-dates">
                              {start} – {end}
                              {duration && ` (${duration})`}
                            </span>
                          )}
                        </span>

                        <span className="app__skills-exp-meta">
                          {isCurrent && <span className="app__skills-exp-now">Current</span>}
                          <span className={`app__skills-exp-type app__skills-exp-type--${type.toLowerCase().replace('-', '')}`}>
                            {type}
                          </span>
                          {hasDesc && (
                            <span className="app__skills-exp-chevron">
                              <Chevron />
                            </span>
                          )}
                        </span>
                      </Row>

                      <AnimatePresence initial={false}>
                        {hasDesc && isOpen && (
                          <motion.div
                            id={`${id}-panel`}
                            className="app__skills-exp-desc"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                          >
                            <div className="app__skills-exp-desc-body">
                              {intro && <p className="app__skills-exp-intro">{intro}</p>}
                              {items.length > 0 && (
                                <ul className="app__skills-exp-points">
                                  {items.map((item, i) => (
                                    <motion.li
                                      key={i}
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                                    >
                                      {item}
                                    </motion.li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
};

export default AppWrap(MotionWrap(Skills, 'app__skills'), 'skills', 'app__whitebg');