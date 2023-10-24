import { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss'
import AnimatedLetters from '../AnimatedLetters'

function Form() {
  

  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef();
  
const nameArray=[ 'When',' ', ' we',' ', 'read,',' ', ' we',' ', ' float' ,' our',' ', ' thoughts',' ', ' into',' ', ' infinite', ' numbers',' ', ' of',' ', ' universes.',' ']
const nameArray2=[ ' Possibilities',' ', ' that',' ', ' will',' ', ' never',' ', ' end.']


const touch = (e) => {
  inputRef.current.focus();
  console.log("Touched")
}

useEffect(() => {
  inputRef.current.focus();
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/page?input=${value}`);
  }

  return (
  <div id="lay" className='layout'>
    <div>
      <div className='name'>
        <h1>Astro</h1>
        <h1 style={{color:"white"}}>pen</h1>
      </div>
    </div>

    <div className='form'>
    <form onSubmit={handleSubmit}>
      <input
      id='inn' 
      className='in'
      placeholder=' Enter your code here'
        type="text"
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)} 
        onClick={touch}
        onTouchStart={touch}
      />
            <img className='ast' src="https://i.postimg.cc/pLh9jBw6/ast.png" alt='astrounant'/>
      <button className='btn' type="submit">
        Search
      </button>
    </form>
    </div>

    <div className='quote'>  
      <AnimatedLetters letterClass={'text-animate'}
        strArray={nameArray}
        idx={5}
        />
        <br/>
        <br/>
       <AnimatedLetters letterClass={'text-animate'}
        strArray={nameArray2}
        idx={32}
        />
      
    </div>
</div>
  );
}

export default Form;