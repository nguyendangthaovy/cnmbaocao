import { useState } from "react";
import { useEffect } from "react";
import { apiRegister } from "../../api/apiRegister";

const CountDown = ({secounds,username }) => {
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(secounds);
    useEffect(() => {
        // if (!timeLeft) return;
        const intervalId = setInterval( async() => {
            // if(resent)
            //     setTimeLeft(60)
            if(timeLeft>0)
                setTimeLeft(timeLeft - 1);
            if(timeLeft===0){
                // await apiRegister.resetOtp({username});
                // setTimeLeft(60);
            }   
        }, 1000);
         return () => clearInterval(intervalId);
      }, [timeLeft]);
    return (
      <div>
        <h1>{timeLeft}</h1>
      </div>
    );
  };
  export default CountDown;