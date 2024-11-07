import React, { useState, useEffect } from 'react';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { AiOutlineDownload } from 'react-icons/ai';
import { client } from '../client';

const SocialMedia = () => {
  const [cvUrl, setCvUrl] = useState('');

  useEffect(() => {
    const query = `*[_type == "cv"][0]{cvFile{asset->{url}}}`;
    client.fetch(query).then((data) => {

      if (data && data.cvFile && data.cvFile.asset && data.cvFile.asset.url) {
        setCvUrl(data.cvFile.asset.url);
      } else {
        console.error("No CV URL found");
      }
    }).catch(error => console.error("Fetch error:", error));
  }, []);


  const handleDownload = () => {
    if (cvUrl) {
      window.open(cvUrl, '_blank');
    } else {
      console.error("CV URL is not available");
    }
  };

  return (
    <div className="app__social">
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
        <button onClick={handleDownload} title="Download CV" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <AiOutlineDownload />
        </button>
      </div>
    </div>
  );
};

export default SocialMedia;
