import React from 'react';

const NavigationDots = ({ active }) => {
  const navigationStyle = {
    position: 'fixed',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10,
  };

  const dotStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#c4c4c4',
    margin: '8px 0',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={navigationStyle}>
      {['home', 'about', 'work', 'skills', 'testimonial', 'contact'].map((item, index) => (
        <a
          href={`#${item}`}
          key={item + index}
          aria-label={`Navigate to ${item} section`}
          style={active === item ? { ...dotStyle, backgroundColor: '#313BAC' } : dotStyle}
        >
          <span className="sr-only">{`Navigate to ${item}`}</span>
        </a>
      ))}
    </div>
  );
};

export default NavigationDots;
