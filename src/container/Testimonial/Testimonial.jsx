import React, { useState, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi'; // Import HiX for the close button icon
import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';
import './Testimonial.scss';

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleClick = (index) => {
    setCurrentIndex(index);
  };

  const toggleCertificate = () => {
    setShowCertificate(!showCertificate);
  };

  useEffect(() => {
    const query = '*[_type == "testimonials"]';
    client.fetch(query).then((data) => {
      setTestimonials(data);
    });
  }, []);

  return (
    <>
      {testimonials.length && (
        <>
          <div className="app__testimonial-item app__flex">
            <img src={urlFor(testimonials[currentIndex].imageurl)} alt={testimonials[currentIndex].name} />
            <div className="app__testimonial-content">
              <div>
                <h4 className="bold-text">{testimonials[currentIndex].name}</h4>
                <h5 className="p-text">{testimonials[currentIndex].company}</h5>
              </div>
              <p className="p-text">{testimonials[currentIndex].feedback}</p>

              <div className="button-container">
                <button onClick={toggleCertificate} className="see-certification-btn">See Certificate</button>
              </div>

              {showCertificate && (
                <div className="certificate-modal">
                  <img src={urlFor(testimonials[currentIndex].certificateurl
                  )} alt="Certification" />
                  <button onClick={toggleCertificate} className="close-modal-btn">
                    <HiX size={24} /> {/* Close button icon */}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="app__testimonial-btns app__flex">
            <div className="app__flex" onClick={() => handleClick(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)}>
              <HiChevronLeft />
            </div>
            <div className="app__flex" onClick={() => handleClick(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)}>
              <HiChevronRight />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Testimonial, 'app__testimonial'),
  'testimonial',
  'app__primarybg',
);
