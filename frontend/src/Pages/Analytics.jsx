import React, {useState, useEffect} from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart, registerables} from 'chart.js'; 
import moment from 'moment';

import './Analytics.css';

Chart.register(...registerables);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Analytics = ({isLoggedInState}) => {

  const [searchTermSorting, setSearchTermSorting] = useState('desc');
  const [searchTerms, setSearchTerms] = useState(null);
  const [yearInputVal, setYearInputVal] = useState(moment().utc().set('hour', moment().utc().hour() + 5)
  .set('minute', moment().utc().minute() + 30).year());

  useEffect(() => {
    const getSearchTerms = async () => {
        const getSearchReq = await fetch(`http://localhost:5000/analytics/searchTerms/${searchTermSorting}`, {
            method: 'GET',
            credentials: 'include'
        });

        const getSearchReqData = await getSearchReq.json();

        if(getSearchReq.ok) {
            setSearchTerms(getSearchReqData.payload);
        }
    }

    getSearchTerms();
  }, []);

  useEffect(() => {
    if(!isLoggedInState) {
      setSearchTerms(null);
    }
  }, [isLoggedInState]);

  return (
    <div>
      <h3>Analytics</h3>

      <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <p className='stats-secondary-header'>View total searches for the year: </p>
        <input style={{padding: '0.25rem 0.5rem'}} onChange={e => {
        if(e.target.value !== '') {
            setYearInputVal(parseInt(e.target.value));
        } else setYearInputVal('');
        }} value={yearInputVal} type="number" />
      </div>

      <div style={{width: '70%', margin: '0 auto'}}>
        {searchTerms && searchTerms.length > 0 && 
          <Bar 
            data = {{
              labels: months,
              datasets: [{
                  label: 'Total searches: ',
                  data: months.map((currentMonth, currentMonthIdx) => {
                    let totalQueries = 0;
                    for(let i = 0; i< searchTerms.length; i++) {
                        if(currentMonthIdx + 1 === searchTerms[i].createdAt.month) {
                            totalQueries += searchTerms[i].totalQueries;
                            console.log(totalQueries);
                        }
                    }

                    return totalQueries;
                  }),
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.8)',
                  ]
              }]
            }}

            style={{
              width: '700px',
              height: '300px'
            }} 
            options={{
              maintainAspectRatio: false
            }}
          />}

          {searchTerms && searchTerms.length === 0 &&
            <p style={{fontSize: '1.5rem'}}>No searches for this year</p>
          }
        </div>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
            <h3>Trending searches: </h3>
            <div style={{display: 'flex', gap: '0.5rem'}}>
                {searchTerms && searchTerms.map((currentSearchTerm, index) => {
                    return (
                    <div key={index} className='stats-stocks-medicine-wrapper'>
                        <p style={{fontSize: '1.5rem', fontWeight: '500'}}>{`${currentSearchTerm.searchTerm}, `}</p>
                        <span style={{fontSize: '1.5rem'}}>{`${currentSearchTerm.totalQueries} times`}</span>
                    </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default Analytics