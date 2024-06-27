import './index.scss';
import { useState,useEffect, React, useRef  } from 'react'
import { default as htmlReactParser } from 'html-react-parser'
import { useLocation } from 'react-router-dom'
import Loader from 'react-loaders'
import { Link } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';


function Page() {

  const [co,setCo]=useState([])
  const [com,setCom]=useState([])
  const [clicked,setClicked]=useState(false)
  const [p,setP]=useState(document.createElement('div'))
  const m = useRef(null);
  const popupRef = useRef(null);
  const location = useLocation();
  const text = new URLSearchParams(location.search).get('input');
  const [texts, setTexts] = useState([]);

  // for the blue backgorund of the paragraph
  const handleMouseEnter = (i) => {
    let r=document.getElementById(i);
     r.className='hove';
  }

  const handleMouseLeave = (i) => {
   let  r=document.getElementById(i);
    r.className='none';
   
  }


  // open and close comment
  function Add(c){
    setClicked(true)
    openPopup(c)
  }

  function remove(){
    setClicked(false)
    closePopup()
  }


//handle clicks
  function handleMouseDown (event) {
    event.preventDefault();   
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener("touchmove", handleToucheMove);
   p.addEventListener('mouseup', handleMouseUp);
   p.addEventListener("touchend",handleMouseUp);
  };

  //handle move the comment
  const handleToucheMove =(event) =>{

    if(event.touches[0].pageX+(popupRef.current.offsetWidth/2) <=m.current.offsetWidth+(m.current.offsetLeft*2) && event.touches[0].pageX-(popupRef.current.offsetWidth/2) >=0)
    { 
    popupRef.current.style.left = `${event.touches[0].pageX-(popupRef.current.offsetWidth/2)  }px`;
    }
    console.log(popupRef.current.offsetHeight);
    if(event.touches[0].pageY-95+popupRef.current.offsetHeight <=m.current.offsetHeight && event.touches[0].pageY-30 >=0)
    { 
    popupRef.current.style.top = `${event.touches[0].pageY-30}px `;
    }
  }

  const handleMouseMove = (event) => {
 
    if(event.clientX +(popupRef.current.offsetWidth/2) <=m.current.offsetWidth+(m.current.offsetLeft*2) && event.clientX-(popupRef.current.offsetWidth/2)   >=0)
    {
    popupRef.current.style.left = `${event.clientX-(popupRef.current.offsetWidth/2) }px`;
    }
    if(event.pageY-95+popupRef.current.offsetHeight <=m.current.offsetHeight  && event.pageY-30 >=0)
    {

    console.log(event.clientY)
    popupRef.current.style.top = `${ event.pageY-30}px`;
    }

   
  };

  // hendle left
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("touchmove", handleToucheMove);
  };

// to get specific comment
  function handleClick(el) {
    const id = el.props.id;
    handleMouseEnter(id)
  
    for(let i = 0; i < co.length; i++) {  
      if(co[i] == id && clicked==false) {
      
       Add(com[i])
        return
      }
    }
  }

   document.addEventListener('click', e => {
     if( clicked==true && document.getElementById("over")==e.target ) {
       remove()
     }
   });

   // get the comment with the record inside
  const  openPopup = async (commentHTML) => {

    let link="n";

    if(commentHTML.search("http")!=-1)
    {
      link =commentHTML.substring(commentHTML.search("http"),commentHTML.length);
      console.log(link)
      link=link.substring(0,link.search("/view"));
      commentHTML=commentHTML.substring(0,commentHTML.search("http"));
    }

    popupRef.current=p;
    p.className = 'popup';
   p.innerHTML=commentHTML


   if(link!="n")
   {
    const audio =document.createElement('audio')
    audio.controls="true"
    audio.controlsList="nodownload"
    const src=document.createElement('source')
    link=link.substring(link.search("/d/")+3,link.length)
    link="https://drive.google.com/file/d/"+link+"preveiw"
    src.src=link
   audio.appendChild(src)
 
   audio.style="margin:8px ; width:100%; color:blue"; 
      p.append(audio);
   }

   p.addEventListener("touchstart",handleMouseDown);
   p.addEventListener('mousedown',handleMouseDown);
   let o=document.getElementById("lay");

    o.append(p); 
     o.addEventListener('mouseup', handleMouseUp);
     o.addEventListener("touchend", handleMouseUp);
    centerPopup();

  }

  function closePopup(){
    p.remove(); 
  }
  

  function centerPopup() {
    const popup = document.querySelector('.popup');
  const width = popup.offsetWidth;
  const height = popup.offsetHeight;
  const windowWidth = window.innerWidth; 
  const windowHeight = window.innerHeight;
  const left = windowWidth / 2 - width / 2;
  const top = windowHeight / 4 - height / 4;
  popup.style.left = `${left}px`;
  popup.style.top = `${ window.scrollY+100}px`;
  }
 
  function Mdown(e)
  {
    e.preventDefault();
  }


  
 
  // to load the data from backend
    useEffect(() => {
      document.addEventListener('mousedown',Mdown)

      const fetchData = async () => {
        try {
          const response = await fetch('https://server-lyart-nine.vercel.app/api', {
         // const response = await fetch('http://localhost:3004/api', {
            method: 'POST',  
            headers: {
              
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              text
            })
          });

        const data = await response.json();


          if(data=="There's no file")
          {
            setTexts(data);
          }
      else
      {

      // handle data
      let d=data.substring(data.search('<body'),data.search('</body>') );
      d=d.substring(d.search('>')+1,d.length );
      let cc='';
      if(d.search('<div')>0)
      {
          cc=d.substring(d.search('<div'),d.length);
          d=d.substring(0,d.search('<div') );
      }

      const context=[]
      let comments=[]
      let j=0,i=0;
      let part;
      while(d.length>10)
      {

       if((d[0]==='<') && (d[1]==='p'))
       {
        if(d.search('</sup>')>-1 && d.search('</sup>')<d.search('/p>'))
        {
          comments.push(i);
          part=`<P id=${i}`
        part+=d.substring(d.search('<p')+2,d.search('<sup'))
        part+='</p>'
        }
        else
        {
          part=`<P id=${i}`
          part+=d.substring(d.search('<p')+2,d.search('/p>')+3)
        }

        context.push(part);
        d=d.substring(d.search('/p>')+3,d.length)
        i++;
       }

       if((d[0]==='<') && (d[1]==='h'))
       {
        part=d.substring(d.search('<h'),d.search('<h')+4)

        if(d.search('</sup>')>-1 && d.search('</sup>')<d.search('</h'))
        {
          comments.push(i);
          part+=`id=${i}`
        part+=d.substring(d.search('<h')+3,d.search('<sup'))
      
        part+=d.substring(d.search('</h')+3,d.search('>')+1)
        }
        else
        {
          part+=`id=${i}`
          part+=d.substring(d.search('<h')+3,d.search('</h')+3)
        }
        
        context.push(part);
        d=d.substring(d.search('</h')+5,d.length)
        i++;
       }
      }

    setCo(comments)
    setTexts(context);


    let ccoments=[]
    while(cc.length>10)
    {
      
        let part=cc.substring(cc.search("<"),cc.search(">")+1)
        cc=cc.substring(cc.search("</a>")+4,cc.length);
        part+=cc.substring(0,cc.search("div>")+4);
        ccoments.push(part);
        cc=cc.substring(cc.search("div>")+4,cc.length);
    }
  
     setCom(ccoments)
    }
   
    


        } catch (error) {
          console.log(error);
        }
      }
  
      fetchData();
     
    }, [text]);
  
    

  return (
    <> 
    <div id="lay" className='layout'>

    {
        texts.length<1 ? 
     <Loader type="ball-pulse-rise"/> 

     :

     texts=="There's no file"?
      <div className='sorry'>
      <div  className='parent2s'>
    <Link to="../">
    <ArrowCircleLeftIcon sx={{color:"white",height:"60px",width:"60px", '&:hover': {color: 'rgb(72, 72, 221)'} }} />
    </Link>
    </div>
     <div class="snowfall"></div>  
     <img className='image' src='https://i.postimg.cc/pdhk7Rph/astro.png' alt='astro'/>  
     <h2>Astropen couldn't reach a document with this code.<br/> Please, check again with your instructor.</h2>
    </div>  

      :

     <div>
      <div  className='parent2'>
    <Link to="../">
    <ArrowCircleLeftIcon sx={{color:"white",height:"60px",width:"60px", marginBottom:"-23px",marginLeft:"-20px", '&:hover': {color: 'rgb(72, 72, 221)'} }}/>
    </Link>
    </div>
      <div className='parent'>
      <div className='code'>{text}</div>
      </div>
      <div ref={m} className='main'>
{texts.map((text, i) => {

const parsed = htmlReactParser(text);
return (
  <div

  style={{width:"100%", height:"fit-content"}}
    key={i}
    onClick={() => handleClick(parsed)}
    onMouseEnter={() =>handleMouseEnter(i)}
   onMouseLeave={() =>handleMouseLeave(i)}

  >
    {parsed}
  </div>
  
      )
                        }
          )
}   
      </div>
      </div>
      }
     {
          clicked && <div id='over' className='overlay'></div>
        }
       
    </div>
     </>
  );
}

export default Page;
