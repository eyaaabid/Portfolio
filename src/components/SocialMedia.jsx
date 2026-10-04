import React, { useState, useEffect } from 'react';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { AiOutlineDownload } from 'react-icons/ai';
import { client } from '../client';

// Name of the file the visitor gets, whatever the PDF is called in Sanity
const DOWNLOAD_NAME = 'eyaabidCV.pdf';

const SocialMedia = () => {
  const [cvUrl, setCvUrl] = useState('');

  useEffect(() => {
    // Most recently updated CV document, so re-uploading in the Studio replaces it
    const query = '*[_type == "cv"] | order(_updatedAt desc)[0]{ "url": file.asset->url }';

    client
      .fetch(query)
      .then((data) => setCvUrl(data?.url || ''))
      .catch((error) => console.error('Failed to load CV:', error));
  }, []);

  return (
    <div className="app__social">
      <div>
        <a href="https://github.com/eyaaabid" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <BsGithub />
        </a>
      </div>
      <div>
        <a
          href="https://www.linkedin.com/in/eya-abid-44953021a/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <BsLinkedin />
        </a>
      </div>
      {/* Only shown once a CV is uploaded and published in the Studio.
          "?dl=" makes Sanity's CDN send the file as a download instead of opening it. */}
      {cvUrl && (
        <div>
          <a href={`${cvUrl}?dl=${DOWNLOAD_NAME}`} download={DOWNLOAD_NAME} title="Download CV" aria-label="Download CV">
            <AiOutlineDownload />
          </a>
        </div>
      )}
    </div>
  );
};

export default SocialMedia;