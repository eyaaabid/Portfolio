import React, { useState, useEffect } from 'react';
import { AiFillEye, AiOutlineClose } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';
import './Work.scss';

const Work = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
  const [works, setWorks] = useState([]);
  const [filterWork, setFilterWork] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const query = '*[_type == "works"]';
    client.fetch(query).then((data) => {
      setWorks(data);
      setFilterWork(data);
    });
  }, []);

  // Close the enlarged image with the Escape key
  useEffect(() => {
    if (!selectedImage) return undefined;
    const onKey = (e) => e.key === 'Escape' && setSelectedImage(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedImage]);

  const handleWorkFilter = (item) => {
    setActiveFilter(item);
    setAnimateCard([{ y: 100, opacity: 0 }]);
    setTimeout(() => {
      setAnimateCard([{ y: 0, opacity: 1 }]);
      setFilterWork(item === 'All' ? works : works.filter((work) => work.tags.includes(item)));
    }, 500);
  };

  const openModal = (imgUrl) => {
    setSelectedImage(imgUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <h2 className='head-text'>My Creative <span>Portfolio</span> Section</h2>

      <div className='app__work-filter'>
        {['UI/UX', 'Web App', 'Mobile App', 'All'].map((item, index) => (
          <div
            key={index}
            onClick={() => handleWorkFilter(item)}
            className={`app__work-filter-item app__flex p-text ${activeFilter === item ? 'item-active' : ''}`}
          >
            {item}
          </div>
        ))}
      </div>

      <motion.div
        animate={animateCard}
        transition={{ duration: 0.5, delayChildren: 0.5 }}
        className='app__work-portfolio'
      >
        {filterWork.map((work, index) => {
          const imgSrc = urlFor(work.imgUrl).url();

          return (
            <div className='app__work-item' key={work._id || index}>
              {/* The whole screenshot is shown (never cropped). The blurred copy behind it
                  fills the empty space, so every card has the same image area. */}
              <div
                className='app__work-img'
                style={{ '--img': `url("${imgSrc}")` }}
                role='button'
                tabIndex={0}
                aria-label={`View ${work.title} larger`}
                onClick={() => openModal(imgSrc)}
                onKeyDown={(e) => e.key === 'Enter' && openModal(imgSrc)}
              >
                <img src={imgSrc} alt={work.title} />
                {/* Hover effect is pure CSS (see Work.scss), so it can never get stuck */}
                <div className='app__work-hover'>
                  <span className='app__work-eye'>
                    <AiFillEye />
                  </span>
                </div>
              </div>

              <div className='app__work-content'>
                {work.tags?.[0] && <span className='app__work-tag'>{work.tags[0]}</span>}
                <h4 className='bold-text'>{work.title}</h4>
                <p className='p-text' title={work.description}>{work.description}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {selectedImage && (
        <div className='app__modal' onClick={closeModal}>
          <div className='app__modal-content' onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt='Enlarged work' />
            <button className='app__modal-close' onClick={closeModal} aria-label='Close'>
              <AiOutlineClose />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AppWrap(MotionWrap(Work, 'app__works'), 'work', 'app__primarybg');