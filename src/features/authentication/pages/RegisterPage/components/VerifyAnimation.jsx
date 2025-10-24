import React, {useEffect, useRef} from 'react'
import Lottie from 'lottie-web'
import verifyAnimation from './verifyAnimation.json'
function VerifyAnimation() {
  const container =useRef(null)
 useEffect(() => {
  const animation = Lottie.loadAnimation({
    container: container.current,
    renderer: 'svg',
    autoplay: true,
    loop: false,
    animationData: verifyAnimation,
  });

  return () => {
    animation.destroy(); // Prevents duplication
  };
}, []);
  
  return (
    <div  className='w-50 h-50' ref={container}></div>
  )
}

export default VerifyAnimation