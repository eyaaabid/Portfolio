import React from 'react';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { AiOutlineDownload } from 'react-icons/ai';

const SocialMedia = () => {
  return (
    <div className='app__social'>
      <div>
        <a href="https://github.com/eyaaabid" target="_blank" rel="noopener noreferrer">
          <BsGithub />
        </a>
      </div>
      <div>
        <a href="https://www.linkedin.com/in/eya-abid-44953021a/" target="_blank" rel="noopener noreferrer">
          <BsLinkedin />
        </a>
      </div>
      <div>
        <a href="/eyaabid__cv.pdf" download title="Download CV">
          <AiOutlineDownload />
        </a>
      </div>
    </div>
  );
};

export default SocialMedia;
