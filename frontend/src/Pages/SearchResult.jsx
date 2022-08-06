import React from 'react';

import './SearchResult.css';

const SearchResult = ({searchResult, setWikipediaHTMLPage}) => {

  const parseRange = document.createRange();
  const parse = Range.prototype.createContextualFragment.bind(parseRange);

  const searchResultPageHandler = () => {
    const searchResultReq = new XMLHttpRequest();
    let searchResultReqData;

    const searchTitle = searchResult.title.replace(' ', '_');

    searchResultReq.open('GET', `http://localhost:5000/read/${searchResult.pageid}/${searchTitle}`);
    searchResultReq.send();

    searchResultReq.onreadystatechange = () => {
        if(searchResultReq.readyState === 4) {
          const document = parse(searchResultReq.response);
          setWikipediaHTMLPage(document.getElementById('content'));
        }
      }
  }
    
  return (
    <div onClick={() => {
        searchResultPageHandler();
    }} className='search-result-wrapper'>
        <h3>{searchResult.title}</h3>
        <p>{searchResult.extract}</p>
    </div>
  )
}

export default SearchResult