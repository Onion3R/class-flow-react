import { PieChart } from 'react-minimal-pie-chart';
import React, {useState, useEffect} from 'react';
export default function SubjectPieChart({label,title,value, className}) {
const [remainingValue, setRemainingValue] = useState(0);

useEffect(() => {
  if (value !== undefined && value !== null) {
    const remainder = 100 - Number(value);
    setRemainingValue(remainder > 0 ? remainder : 0);
  }
}, [value]);
  


  return (
    <div className='relative'>
      <h1 className='absolute font-medium text-sm'>{label}</h1>
    <PieChart
      data={[
        { title: title, value: Number(value), color: '#155dff' },
        { title: 'Remaining Value', value: remainingValue, color: '#272729' },
      ]}
      // label={({ dataEntry }) => `${dataEntry.title} (${dataEntry.value}%)`}
      labelStyle={{
        fontSize: '5px',
        fontFamily: '',
        fill: '#fff',
      }}
      radius={42}
      // labelPosition={60}
      className={`w-60 ${className}`}
    />
    </div>
  );
}
