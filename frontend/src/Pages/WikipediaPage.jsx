import React from 'react';
import DOMPurify from 'dompurify';
import parse from "html-react-parser";

const WikipediaPage = ({wikipediaHTMLPage}) => {
   
  const cleanHtmlString = DOMPurify.sanitize(wikipediaHTMLPage,
  { USE_PROFILES: { html: true } });

  const content = parse(cleanHtmlString);

  return (
    <>
      {content}
    </>
  )
}

export default WikipediaPage