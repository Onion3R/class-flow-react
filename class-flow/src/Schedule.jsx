import { useEffect, useState } from 'react';

function Schedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/schedule/')
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
      })
      .catch((err) => {
        console.error('Failed to fetch schedule:', err);
      });
  }, []);

  return (
    <div>
      <h1>Class Schedule</h1>
      {Object.entries(schedule).map(([section, days]) => (
        <div key={section}>
          <h2>Section: {section}</h2>
          {Object.entries(days).map(([day, classes]) => (
            <div key={day}>
              <h3>{day}</h3>
              <ul>
                {classes.map((c, index) => (
                  <li key={index}>
                    {c.time} - {c.subject} ({c.professor})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Schedule;
