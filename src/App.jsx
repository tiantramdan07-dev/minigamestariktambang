import { useState, useEffect, useRef, useCallback } from "react";
import { loadTeachers, saveTeachers } from "./storage";

/* ── DATA SOAL ── */
const QBJ=[
  {id:1,type:"CANGKRIMAN WANCANAN",typeDesc:"Singkatan",soal:"BOCAH SING ORA GELEM SENENG?",options:["Bocah dolan","Bocah sekolah","Bocah seneng","Bocah nakal"],answer:1,explanation:"Bocah sekolah — 'ora gelem seneng' tegese bocah sing kerja keras ing sekolah."},
  {id:2,type:"CANGKRIMAN WANCANAN",typeDesc:"Singkatan",soal:"PAKBOLETUS = ?",options:["Pak bole tutup","Tapak kebo lelene satus","Pak bolet ngutus","Tapak kebo gunung"],answer:1,explanation:"PAK-BO-LE-TUS = TaPAK KEbo LELEne susTUS — wancahan saka tembung-tembung."},
  {id:3,type:"CANGKRIMAN WANCANAN",typeDesc:"Singkatan",soal:"NASBUNG = ?",options:["Nasi bungkus","Nas mabung","Anak kembung","Nanas bungkus"],answer:0,explanation:"NASBUNG = NASi BUNGkus — cangkriman wancahan saka tembung sing dicekak."},
  {id:4,type:"CANGKRIMAN BLENDERAN",typeDesc:"Plesetan",soal:"WONG ADOL TEMPE DITALENI — SING DITALENI APO?",options:["Wong adol tempe","Tempe-ne","Tali-ne","Bocah-e"],answer:1,explanation:"Sing ditaleni TEMPE-NE, dudu wong sing adol — blenderan bermain pergeseran makna."},
  {id:5,type:"CANGKRIMAN BLENDERAN",typeDesc:"Plesetan",soal:"APA BEDANE GAJAH LAN SEMUT?",options:["Ukurane","Abote","Jenenge","Ora ono bedane"],answer:3,explanation:"Ora ono bedane — loro-lorone duwe jeneng 'kewan' (hewan) — blenderan jenaka!"},
  {id:6,type:"CANGKRIMAN PEPINDHAN",typeDesc:"Perumpamaan",soal:"GAJAH NGUNTAL SANGKRAH = ?",options:["Gudang","Pawon / Luweng","Kandang gajah","Sumur"],answer:1,explanation:"PAWON/LUWENG (dapur) — gajah = tungku besar, sangkrah = kayu bakar."},
  {id:7,type:"CANGKRIMAN PEPINDHAN",typeDesc:"Perumpamaan",soal:"BAPAK DEMANG KLAMBI ABANG DISUDUK MANTHUK-MANTHUK?",options:["Jantung Gedhang","Lombok Abang","Kembang Mawar","Gedhang Mateng"],answer:0,explanation:"JANTUNG GEDHANG — klambi abang = warnane abang, manthuk-manthuk = nalika diiris."},
  {id:8,type:"CANGKRIMAN PEPINDHAN",typeDesc:"Perumpamaan",soal:"PITIK WALIK SABA KEBON, BOCAH APA?",options:["Nanas","Nangka","Durian","Salak"],answer:0,explanation:"NANAS — kulite seperti bulu ayam yang balik (mata nanas), saba kebon = hidup di kebun."},
  {id:9,type:"CANGKRIMAN WANCANAN",typeDesc:"Singkatan",soal:"BURNAS KOPONG = ?",options:["Bubur panas kopong","Sumber nasib kosong","Sumber nasib panjang","Bubur nasi kopong"],answer:0,explanation:"BURNAS KOPONG = BUbuR NASi KOPong — singkatan dari suku kata bubur nasi."},
  {id:10,type:"CANGKRIMAN PEPINDHAN",typeDesc:"Perumpamaan",soal:"DIKETHOK MALAH DAWA, DIJUNJUNG MALAH CENDHEK?",options:["Celana panjang","Sumur","Parit / got","Benang"],answer:1,explanation:"SUMUR — semakin digali makin dalam, semakin diambil airnya makin berkurang."},
  {id:11,type:"CANGKRIMAN BLENDERAN",typeDesc:"Plesetan",soal:"KEBO NUSU GUDEL TEGESE APA?",options:["Sapi nyusoni anake","Wong tuwa jaluk tulung anake","Gudel momong kebo","Kebo cilik nyusu"],answer:1,explanation:"Wong tuwa jaluk tulung anake — kebo = orang tua, gudel = anak, nusu = minta bantuan."},
  {id:12,type:"CANGKRIMAN PEPINDHAN",typeDesc:"Perumpamaan",soal:"EMBOKE DIIDAK-IDAK ANAKE DIGENDONG?",options:["Sandal","Gedhang","Genthong","Sepatu"],answer:1,explanation:"GEDHANG (pisang) — emboke = batang pohon pisang diinjak, anake = buah pisang dipetik."},
];
const QMATH=[
  {id:1,type:"MATEMATIKA",typeDesc:"Perkalian",soal:"Berapa hasil dari 15 × 8?",options:["100","110","120","130"],answer:2,explanation:"120 — Cara: (10×8) + (5×8) = 80 + 40 = 120."},
  {id:2,type:"MATEMATIKA",typeDesc:"Pecahan",soal:"1/2 + 1/4 = ?",options:["1/6","2/6","3/4","1/3"],answer:2,explanation:"3/4 — Samakan penyebut: 1/2 = 2/4, maka 2/4 + 1/4 = 3/4."},
  {id:3,type:"MATEMATIKA",typeDesc:"Keliling",soal:"Keliling persegi dengan sisi 7 cm adalah...",options:["14 cm","21 cm","28 cm","49 cm"],answer:2,explanation:"28 cm — Rumus keliling persegi = 4 × sisi = 4 × 7 = 28 cm."},
  {id:4,type:"MATEMATIKA",typeDesc:"FPB",soal:"FPB dari 12 dan 18 adalah...",options:["2","3","6","9"],answer:2,explanation:"6 — Faktor 12: 1,2,3,4,6,12. Faktor 18: 1,2,3,6,9,18. FPB = 6."},
  {id:5,type:"MATEMATIKA",typeDesc:"Persentase",soal:"25% dari 80 adalah...",options:["15","20","25","30"],answer:1,explanation:"20 — 25% = 1/4, jadi 1/4 × 80 = 20."},
  {id:6,type:"MATEMATIKA",typeDesc:"Pembagian",soal:"84 ÷ 12 = ?",options:["6","7","8","9"],answer:1,explanation:"7 — Karena 12 × 7 = 84."},
  {id:7,type:"MATEMATIKA",typeDesc:"Luas",soal:"Luas persegi panjang 8 cm × 5 cm adalah...",options:["26 cm²","30 cm²","40 cm²","46 cm²"],answer:2,explanation:"40 cm² — Luas = panjang × lebar = 8 × 5 = 40 cm²."},
];
const QIPA=[
  {id:1,type:"IPA",typeDesc:"Fotosintesis",soal:"Proses fotosintesis pada tumbuhan menghasilkan...",options:["CO₂ dan air","O₂ dan glukosa","H₂O dan mineral","N₂ dan protein"],answer:1,explanation:"O₂ dan glukosa — Fotosintesis: CO₂ + H₂O + cahaya → C₆H₁₂O₆ + O₂."},
  {id:2,type:"IPA",typeDesc:"Tata Surya",soal:"Planet yang paling dekat dengan Matahari adalah...",options:["Venus","Bumi","Merkurius","Mars"],answer:2,explanation:"Merkurius — Planet terdekat dari Matahari, berjarak ±57,9 juta km."},
  {id:3,type:"IPA",typeDesc:"Gaya",soal:"Gaya yang ditimbulkan oleh magnet disebut gaya...",options:["Gesek","Gravitasi","Magnet","Pegas"],answer:2,explanation:"Gaya Magnet — dapat menarik benda besi/baja tanpa bersentuhan langsung."},
  {id:4,type:"IPA",typeDesc:"Ekosistem",soal:"Organisme yang memakan tumbuhan disebut...",options:["Produsen","Konsumen I","Konsumen II","Decomposer"],answer:1,explanation:"Konsumen I (herbivora) — memperoleh energi langsung dari tumbuhan."},
  {id:5,type:"IPA",typeDesc:"Konduksi",soal:"Benda yang dapat menghantarkan panas dengan baik disebut...",options:["Isolator","Konduktor","Semikonduktor","Resistor"],answer:1,explanation:"Konduktor — bahan yang mudah menghantarkan panas, contoh: logam."},
  {id:6,type:"IPA",typeDesc:"Metamorfosis",soal:"Metamorfosis sempurna terjadi pada...",options:["Belalang","Nyamuk","Kecoa","Capung"],answer:1,explanation:"Nyamuk — metamorfosis sempurna: telur → larva → pupa → imago."},
];
const QIPS=[
  {id:1,type:"IPS",typeDesc:"Geografi",soal:"Ibu kota negara Indonesia adalah...",options:["Surabaya","Bandung","Jakarta","Yogyakarta"],answer:2,explanation:"Jakarta — ibu kota Indonesia sejak kemerdekaan 1945."},
  {id:2,type:"IPS",typeDesc:"Sejarah",soal:"Proklamasi kemerdekaan Indonesia dibacakan pada...",options:["17 Agustus 1945","17 Agustus 1944","17 Juli 1945","17 September 1945"],answer:0,explanation:"17 Agustus 1945 — Dibacakan Soekarno-Hatta di Jalan Pegangsaan Timur 56."},
  {id:3,type:"IPS",typeDesc:"Ekonomi",soal:"Kegiatan ekonomi yang menghasilkan barang/jasa disebut...",options:["Konsumsi","Distribusi","Produksi","Investasi"],answer:2,explanation:"Produksi — kegiatan membuat/menghasilkan barang/jasa."},
  {id:4,type:"IPS",typeDesc:"Peta",soal:"Garis khayal yang membagi bumi menjadi belahan utara dan selatan disebut...",options:["Garis bujur","Garis lintang","Garis ekuator","Garis datang"],answer:2,explanation:"Garis Ekuator (Khatulistiwa) — garis lintang 0°."},
  {id:5,type:"IPS",typeDesc:"Geografi",soal:"Pulau terbesar di Indonesia adalah...",options:["Jawa","Sulawesi","Sumatra","Kalimantan"],answer:3,explanation:"Kalimantan — pulau terbesar di Indonesia dengan luas ±743.000 km²."},
  {id:6,type:"IPS",typeDesc:"Sejarah",soal:"Siapa yang menjadi presiden pertama Indonesia?",options:["Mohammad Hatta","Suharto","Soekarno","Habibie"],answer:2,explanation:"Soekarno — menjabat sebagai Presiden RI pertama dari 1945 hingga 1967."},
];
const QBING=[
  {id:1,type:"BAHASA INGGRIS",typeDesc:"Vocabulary",soal:"What is the English word for 'Rumah'?",options:["Home","School","Garden","Market"],answer:0,explanation:"Home — 'Rumah' dalam Bahasa Inggris adalah 'Home' atau 'House'."},
  {id:2,type:"BAHASA INGGRIS",typeDesc:"Grammar",soal:"Complete: 'She ___ to school every day.'",options:["go","goes","going","gone"],answer:1,explanation:"Goes — Untuk subjek orang ketiga tunggal (she/he/it) dalam simple present."},
  {id:3,type:"BAHASA INGGRIS",typeDesc:"Vocabulary",soal:"What is the plural of 'child'?",options:["childs","childes","children","childrens"],answer:2,explanation:"Children — 'Child' adalah kata benda tidak beraturan."},
  {id:4,type:"BAHASA INGGRIS",typeDesc:"Tenses",soal:"'I ___ to the market yesterday.' - which is correct?",options:["go","goes","went","going"],answer:2,explanation:"Went — Simple past tense dari 'go' adalah 'went'."},
];

const INIT_TEACHERS = {
  bj:{id:"bj",name:"Guru Bahasa Jawa",subject:"Bahasa Jawa",pass:"bj123",color:"#16a085",icon:"📚",q:[...QBJ],cfg:{time:15,win:7}},
  math:{id:"math",name:"Guru Matematika",subject:"Matematika",pass:"math123",color:"#2980b9",icon:"🔢",q:[...QMATH],cfg:{time:20,win:7}},
  ipa:{id:"ipa",name:"Guru IPA",subject:"IPA",pass:"ipa123",color:"#8e44ad",icon:"🔬",q:[...QIPA],cfg:{time:15,win:7}},
  ips:{id:"ips",name:"Guru IPS",subject:"IPS",pass:"ips123",color:"#d35400",icon:"🌍",q:[...QIPS],cfg:{time:15,win:7}},
  bing:{id:"bing",name:"Guru Bahasa Inggris",subject:"Bahasa Inggris",pass:"bing123",color:"#c0392b",icon:"🌐",q:[...QBING],cfg:{time:20,win:5}},
  admin:{id:"admin",name:"Administrator",subject:"Admin",pass:"admin123",color:"#7f8c8d",icon:"⚙️",q:[],cfg:{time:15,win:7}},
};

const OL=['A','B','C','D'];
const OC=['#c0392b','#d4a017','#27ae60','#2471a3'];
const RDUR=2000;
function shuf(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b;}

/* ── CSS INJECTION ── */
function useStyles(){
  useEffect(()=>{
    const id='tt-styles-v2';
    if(document.getElementById(id))return;
    const s=document.createElement('style');
    s.id=id;
    s.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700;900&display=swap');
      *,*::before,*::after{box-sizing:border-box;}
      @keyframes timerBlink{0%,100%{opacity:1}50%{opacity:0.15}}
      @keyframes floatIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulseGold{0%,100%{filter:brightness(1)}50%{filter:brightness(1.2)}}
      @keyframes pullLeft{0%,100%{transform:translateX(0)}50%{transform:translateX(-5px)}}
      @keyframes pullRight{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
      @keyframes victoryBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.08) translateY(-5px)}}
      @keyframes cloudDrift{from{transform:translateX(-120px)}to{transform:translateX(105vw)}}
      @keyframes confettiFall{from{opacity:1;transform:translateY(-10px) rotate(0deg)}to{opacity:0;transform:translateY(95vh) rotate(720deg)}}
      @keyframes musicPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
      @keyframes ropeShake{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.04)}}
      @keyframes scorePopA{0%{transform:scale(1)}50%{transform:scale(1.3);color:#ff6666}100%{transform:scale(1)}}
      @keyframes scorePopB{0%{transform:scale(1)}50%{transform:scale(1.3);color:#66aaff}100%{transform:scale(1)}}
      input:focus,button:focus,textarea:focus{outline:none;}
      button{cursor:pointer;}
      .game-scroll::-webkit-scrollbar{width:4px;}
      .game-scroll::-webkit-scrollbar-track{background:rgba(0,0,0,0.15);}
      .game-scroll::-webkit-scrollbar-thumb{background:#8b5e00;border-radius:2px;}
      .review-scroll::-webkit-scrollbar{width:4px;}
      .review-scroll::-webkit-scrollbar-track{background:rgba(255,255,255,0.04);}
      .review-scroll::-webkit-scrollbar-thumb{background:#8b5e00;border-radius:2px;}
    `;
    document.head.appendChild(s);
  },[]);
}

/* ── VIEWPORT HOOK ── */
function useViewport(){
  const[d,setD]=useState({w:window.innerWidth,h:window.innerHeight});
  useEffect(()=>{
    const h=()=>setD({w:window.innerWidth,h:window.innerHeight});
    window.addEventListener('resize',h);
    return()=>window.removeEventListener('resize',h);
  },[]);
  return{
    width:d.w,height:d.h,
    isMobile:d.w<480,
    isSmallTablet:d.w>=480&&d.w<768,
    isTablet:d.w>=768&&d.w<1100,
    isLarge:d.w>=1100,
    isTouch:'ontouchstart'in window,
  };
}

/* ── BACKGROUND MUSIC ── */
function useBgMusic(){
  const ctxRef=useRef(null),masterRef=useRef(null),schedRef=useRef(null),liveRef=useRef(false);
  const stopMusic=useCallback(()=>{
    liveRef.current=false;clearTimeout(schedRef.current);
    if(masterRef.current&&ctxRef.current){try{masterRef.current.gain.setTargetAtTime(0.001,ctxRef.current.currentTime,0.5);}catch(e){}}
  },[]);
  const startMusic=useCallback(()=>{
    try{
      if(!ctxRef.current||ctxRef.current.state==='closed')ctxRef.current=new(window.AudioContext||window.webkitAudioContext)();
      const ctx=ctxRef.current;
      if(ctx.state==='suspended')ctx.resume();
      if(!masterRef.current){masterRef.current=ctx.createGain();masterRef.current.connect(ctx.destination);masterRef.current.gain.value=0;}
      masterRef.current.gain.setTargetAtTime(0.2,ctx.currentTime,0.7);
      liveRef.current=true;
      const P=[261.6,293.7,329.6,370.0,415.3,466.2,523.3,587.3];
      const MEL=[0,2,4,5,4,2,1,0,2,4,6,5,4,2,0,2,1,3,5,6,5,3,1,2,4,5,4,2,0,1,2,0];
      const BAS=[0,0,2,2,4,4,0,0,2,2,4,4,2,2,0,0,1,1,3,3,5,5,1,1,4,4,2,2,0,0,2,0];
      const beat=60/132/2,patLen=MEL.length*beat;
      const note=(f,t,d,v,tp='triangle')=>{
        const o=ctx.createOscillator(),g=ctx.createGain();
        o.type=tp;o.frequency.value=f;o.connect(g);g.connect(masterRef.current);
        g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+0.013);g.gain.exponentialRampToValueAtTime(0.001,t+d);
        o.start(t);o.stop(t+d+0.05);
      };
      const sched=(t0)=>{
        if(!liveRef.current)return;
        MEL.forEach((ni,i)=>{note(P[ni%P.length],t0+i*beat,beat*0.72,0.1);if(i%4===0)note(P[(ni+2)%P.length],t0+i*beat,beat*0.5,0.05,'sine');});
        BAS.forEach((ni,i)=>{if(i%2!==0)return;note(P[ni%P.length]*0.5,t0+i*beat,beat*1.7,0.08,'sine');});
        schedRef.current=setTimeout(()=>{if(liveRef.current)sched(ctx.currentTime+0.08);},(patLen-0.2)*1000);
      };
      sched(ctx.currentTime+0.18);
    }catch(e){}
  },[]);
  return{startMusic,stopMusic};
}

/* ── CHARACTER SVG ── */
function Character({team,state='idle',index=0,size=52}){
  const isA=team==='A';
  const cloth=isA?'#c0392b':'#2471a3',hband=isA?'#ff8c00':'#33aaff',skin='#D4A76A',dark='#8B6530',hair='#3d1f00';
  const lean={idle:isA?-13:13,pulling:isA?-22:22,stumbling:isA?-5:5,victory:0}[state]??0;
  const h=Math.round(size*1.35);
  return(
    <div style={{width:`${size}px`,height:`${h}px`,flexShrink:0,animationDelay:`${index*0.04}s`}}>
      <svg viewBox="0 0 52 70" width={size} height={h} style={{overflow:'visible'}}>
        <ellipse cx="26" cy="69" rx="17" ry="3.5" fill="rgba(0,0,0,0.22)"/>
        <g transform={`rotate(${lean},26,68)`}>
          <rect x={isA?14:28} y="48" width="10" height="22" rx="3.5" fill={dark}/>
          <rect x={isA?28:14} y="50" width="10" height="20" rx="3.5" fill="#6B4A20" transform={`rotate(${isA?5:-5},${isA?33:19},50)`}/>
          <rect x="13" y="25" width="26" height="26" rx="5" fill={cloth}/>
          <path d="M15,33 C18,31 22,35 26,33 C30,31 34,35 37,33" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
          <path d="M15,40 C18,38 22,42 26,40 C30,38 34,42 37,40" stroke="rgba(255,255,255,0.11)" strokeWidth="1.5" fill="none"/>
          {isA?(<g><rect x="37" y="25" width="16" height="7" rx="3.5" fill={skin} transform="rotate(-18,37,28.5)"/><ellipse cx="51" cy="21" rx="5" ry="5" fill={skin}/></g>):(<g><rect x="-1" y="25" width="16" height="7" rx="3.5" fill={skin} transform="rotate(18,15,28.5)"/><ellipse cx="1" cy="21" rx="5" ry="5" fill={skin}/></g>)}
          {isA?(<rect x="2" y="28" width="13" height="7" rx="3.5" fill={skin} transform="rotate(22,8.5,31.5)"/>):(<rect x="37" y="28" width="13" height="7" rx="3.5" fill={skin} transform="rotate(-22,43.5,31.5)"/>)}
          <ellipse cx="26" cy="18" rx="12" ry="12" fill={skin}/>
          <ellipse cx="26" cy="10" rx="11" ry="6.5" fill={hair}/>
          <rect x="14" y="13" width="24" height="4.5" rx="2.5" fill={hband}/>
          <ellipse cx={isA?38:14} cy="15" rx="3.5" ry="2" fill={hband} opacity="0.72"/>
          <ellipse cx="21" cy="18" rx="2.5" ry="3" fill="#1a1a1a"/><ellipse cx="31" cy="18" rx="2.5" ry="3" fill="#1a1a1a"/>
          <ellipse cx="21" cy="17" rx="1" ry="1.4" fill="rgba(255,255,255,0.88)"/><ellipse cx="31" cy="17" rx="1" ry="1.4" fill="rgba(255,255,255,0.88)"/>
          {state==='pulling'&&<path d="M21,24 Q26,28 31,24" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>}
          {state==='stumbling'&&<path d="M21,25 Q26,21 31,25" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>}
          {state==='victory'&&<path d="M20,24 Q26,29 32,24" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>}
          {state==='idle'&&<path d="M21,23 Q26,26 31,23" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>}
          {state==='victory'&&<text x={isA?"-3":"34"} y="8" fontSize="9" fill="#ffd700" opacity="0.9">✦</text>}
          {state==='stumbling'&&<><ellipse cx="38" cy="12" rx="2" ry="3" fill="#88aaff" opacity="0.65"/><ellipse cx="42" cy="17" rx="1.5" ry="2.5" fill="#88aaff" opacity="0.45"/></>}
        </g>
      </svg>
    </div>
  );
}

/* ── ARENA ── */
function Arena({ropePosition,animState}){
  const {isMobile,isSmallTablet,isTablet,isLarge}=useViewport();
  const compact=isMobile||isSmallTablet;
  const charCount=isMobile?3:isSmallTablet?4:isTablet?5:6;
  const charSize=isMobile?30:isSmallTablet?36:isTablet?44:isLarge?62:50;
  const ropeShift=ropePosition*(isMobile?10:isTablet?15:17);
  const ropeW=isMobile?140:isSmallTablet?190:isTablet?240:isLarge?340:260;
  const ropeH=Math.round(ropeW*0.085);
  const overlap=Math.round(charSize*0.28);
  const stateA=animState?.A||'idle';
  const stateB=animState?.B||'idle';

  return(
    <div style={{position:'relative',flex:1,minHeight:0,overflow:'hidden',
      background:'linear-gradient(180deg,#87CEEB 0%,#b8e4f9 30%,#5a9e30 70%,#3d7a1a 100%)'}}>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#3a8fd9 0%,#87ceeb 28%,transparent 55%)'}}/>
      {!isMobile&&[{top:'8%',w:90,spd:32,dl:0},{top:'13%',w:62,spd:22,dl:-9},{top:'6%',w:115,spd:44,dl:-18}].map((c,i)=>(
        <div key={i} style={{position:'absolute',top:c.top,width:`${c.w}px`,height:`${Math.round(c.w*0.34)}px`,
          background:'rgba(255,255,255,0.7)',borderRadius:'50px',filter:'blur(5px)',opacity:0.5,
          animation:`cloudDrift ${c.spd}s linear infinite`,animationDelay:`${c.dl}s`}}/>
      ))}
      {/* Background buildings */}
      <div style={{position:'absolute',top:'4%',left:0,right:0,bottom:0}}>
        {!isMobile&&[4,11,17,72,78,84].map((x,i)=>{
          const ts=isLarge?56:isTablet?44:36;
          return(<div key={i} style={{position:'absolute',left:`${x}%`,top:'12%'}}>
            <svg viewBox="0 0 44 66" width={ts} height={Math.round(ts*1.5)}>
              <rect x="18" y="44" width="8" height="22" fill="#5d3a1a"/>
              <ellipse cx="22" cy="30" rx="18" ry="22" fill="#2e7d32" opacity="0.8"/>
              <ellipse cx="22" cy="24" rx="14" ry="17" fill="#43a047"/>
              <ellipse cx="22" cy="18" rx="9" ry="12" fill="#66bb6a"/>
            </svg>
          </div>);
        })}
        {!compact&&(
          <>
            <div style={{position:'absolute',left:'23%',top:'4%'}}>
              <svg viewBox="0 0 130 110" width={isLarge?160:110} height={isLarge?135:93}>
                <rect x="18" y="58" width="94" height="52" fill="#d4a574"/>
                <polygon points="8,58 65,8 122,58" fill="#8B4513"/>
                <polygon points="20,58 65,16 110,58" fill="#A0522D"/>
                <rect x="48" y="75" width="30" height="35" fill="#3d1f00"/>
                <rect x="28" y="65" width="16" height="22" rx="2" fill="#87ceeb" opacity="0.55"/>
                <rect x="86" y="65" width="16" height="22" rx="2" fill="#87ceeb" opacity="0.55"/>
              </svg>
            </div>
            <div style={{position:'absolute',left:'50%',top:'0%',transform:'translateX(-50%)'}}>
              <svg viewBox="0 0 200 130" width={isLarge?250:160} height={isLarge?163:104}>
                <rect x="15" y="76" width="170" height="54" fill="#d4a574"/>
                <polygon points="0,76 100,8 200,76" fill="#6B3A1A"/>
                <polygon points="14,76 100,18 186,76" fill="#8B4513"/>
                <polygon points="28,76 100,26 172,76" fill="#A0522D"/>
                {[42,70,100,130,158].map((x,i)=><rect key={i} x={x} y="76" width="9" height="54" fill="#7a5c1e"/>)}
                <rect x="30" y="96" width="50" height="34" fill="#3d1f00"/>
                <rect x="120" y="96" width="50" height="34" fill="#3d1f00"/>
                <rect x="0" y="8" width="3" height="48" fill="#5d3a1a"/>
                <polygon points="3,8 22,20 3,32" fill="#cc0000"/>
                <rect x="197" y="8" width="3" height="48" fill="#5d3a1a"/>
                <polygon points="197,8 178,20 197,32" fill="#ffffff"/>
              </svg>
            </div>
            <div style={{position:'absolute',right:'23%',top:'4%'}}>
              <svg viewBox="0 0 130 110" width={isLarge?160:110} height={isLarge?135:93}>
                <rect x="18" y="58" width="94" height="52" fill="#d4a574"/>
                <polygon points="8,58 65,8 122,58" fill="#8B4513"/>
                <rect x="48" y="75" width="30" height="35" fill="#3d1f00"/>
              </svg>
            </div>
          </>
        )}
      </div>
      {/* Ground */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'40%',
        background:'linear-gradient(180deg,#5a9e30 0%,#3d7a1a 40%,#2d5a12 100%)'}}>
        {!isMobile&&Array.from({length:18}).map((_,i)=>(
          <div key={i} style={{position:'absolute',left:`${i*5.5+1}%`,bottom:'78%',fontSize:isLarge?'18px':'13px',opacity:0.35}}>🌿</div>
        ))}
        {[8,22,45,60,78,92].map((x,i)=>(
          <div key={i} style={{position:'absolute',left:`${x}%`,bottom:'74%',fontSize:isMobile?'9px':isLarge?'16px':'11px',opacity:0.6}}>🌸</div>
        ))}
      </div>
      {/* Characters + Rope */}
      <div style={{position:'absolute',bottom:'28%',left:0,right:0,display:'flex',alignItems:'flex-end',justifyContent:'center',padding:compact?'0 2px':'0 12px'}}>
        <div style={{display:'flex',alignItems:'flex-end',transform:`translateX(${ropeShift*0.5}px)`,transition:'transform 0.4s ease',
          animation:stateA==='pulling'?'pullLeft 0.38s ease infinite':'none',marginRight:`-${overlap}px`,zIndex:2}}>
          {Array.from({length:charCount}).map((_,i)=><Character key={i} team="A" state={stateA} index={i} size={charSize}/>)}
        </div>
        <div style={{position:'relative',width:`${ropeW}px`,height:`${ropeH}px`,flexShrink:0,marginBottom:compact?'12px':'20px',zIndex:3}}>
          <svg viewBox={`0 0 ${ropeW} 22`} width={ropeW} height={ropeH} style={{overflow:'visible'}}>
            <defs>
              <linearGradient id="rg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d4924a"/><stop offset="45%" stopColor="#8B4513"/><stop offset="100%" stopColor="#4a1e00"/>
              </linearGradient>
            </defs>
            <path d={`M0,18 Q${ropeW*.25},${16+ropePosition} ${ropeW*.5+ropeShift*.38},${17+ropePosition*.55} Q${ropeW*.75},${18-ropePosition*.38} ${ropeW},18`} stroke="rgba(0,0,0,0.3)" strokeWidth="13" fill="none" strokeLinecap="round"/>
            <path d={`M0,12 Q${ropeW*.25},${10+ropePosition} ${ropeW*.5+ropeShift*.38},${11+ropePosition*.55} Q${ropeW*.75},${12-ropePosition*.38} ${ropeW},12`} stroke="url(#rg)" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <path d={`M0,11 Q${ropeW*.25},${9+ropePosition} ${ropeW*.5+ropeShift*.38},${10+ropePosition*.55} Q${ropeW*.75},${11-ropePosition*.38} ${ropeW},11`} stroke="#a05c2a" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="14,4" opacity="0.85"/>
            <path d={`M0,9 Q${ropeW*.25},${7+ropePosition} ${ropeW*.5+ropeShift*.38},${8+ropePosition*.55} Q${ropeW*.75},${9-ropePosition*.38} ${ropeW},9`} stroke="#c07840" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="8,7" opacity="0.7"/>
            <circle cx={ropeW*.5+ropeShift*.38} cy={compact?10:11} r={compact?7:9} fill="#ffd700" stroke="#8b5e00" strokeWidth="2.5"/>
            <circle cx={ropeW*.5+ropeShift*.38} cy={compact?10:11} r={compact?4:5.5} fill="#ff4500"/>
            <circle cx={ropeW*.5+ropeShift*.38} cy={compact?10:11} r={compact?1.8:2.8} fill="#ffdd00"/>
          </svg>
        </div>
        <div style={{display:'flex',alignItems:'flex-end',transform:`translateX(${ropeShift*0.5}px)`,transition:'transform 0.4s ease',
          animation:stateB==='pulling'?'pullRight 0.38s ease infinite':'none',marginLeft:`-${overlap}px`,zIndex:2}}>
          {Array.from({length:charCount}).map((_,i)=><Character key={i} team="B" state={stateB} index={i} size={charSize}/>)}
        </div>
      </div>
      {/* Tug indicator bar */}
      <div style={{position:'absolute',bottom:compact?'50%':'52%',left:'50%',
        transform:`translateX(calc(-50% + ${ropeShift*.3}px))`,transition:'transform 0.4s',zIndex:10}}>
        <div style={{display:'flex',alignItems:'center',gap:'4px',background:'rgba(0,0,0,0.55)',
          borderRadius:'20px',padding:compact?'2px 6px':'3px 10px',border:'1px solid rgba(255,215,0,0.3)'}}>
          <span style={{fontSize:compact?'9px':'10px',color:'#ff4444',fontFamily:'Rajdhani',fontWeight:700}}>A</span>
          <div style={{width:compact?'46px':'76px',height:'8px',background:'rgba(255,255,255,0.1)',borderRadius:'4px',overflow:'hidden',position:'relative'}}>
            <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${50-ropePosition*5}%`,background:'linear-gradient(90deg,#ff4444,#ff8800)',borderRadius:'4px',transition:'width 0.4s'}}/>
            <div style={{position:'absolute',right:0,top:0,bottom:0,width:`${50+ropePosition*5}%`,background:'linear-gradient(270deg,#4488ff,#0044cc)',borderRadius:'4px',transition:'width 0.4s'}}/>
          </div>
          <span style={{fontSize:compact?'9px':'10px',color:'#4488ff',fontFamily:'Rajdhani',fontWeight:700}}>B</span>
        </div>
      </div>
    </div>
  );
}

/* ── SCOREBOARD ── */
function TeamPanel({name,score,side,color,glowColor,isActive,winningScore,icon,iconSide,compact,isTablet,scoreAnim}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:compact?'5px':'9px',
      flexDirection:iconSide==='right'?'row-reverse':'row',
      flex:compact?'0 0 auto':1,minWidth:compact?'85px':isTablet?'140px':'185px'}}>
      {!compact&&<div style={{width:isTablet?'44px':'52px',height:isTablet?'44px':'52px',borderRadius:'50%',
        background:`radial-gradient(circle,${color}99,${color}44)`,
        border:`${compact?2:3}px solid ${isActive?glowColor:color}`,
        display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
        boxShadow:isActive?`0 0 18px ${glowColor},0 0 35px ${glowColor}44`:`0 0 8px ${color}44`,transition:'all 0.3s'}}>
        {icon}
      </div>}
      <div style={{background:`linear-gradient(135deg,${color}cc,${color}88)`,
        border:`2px solid ${isActive?glowColor:color}`,borderRadius:'8px',
        padding:compact?'3px 7px':isTablet?'4px 10px':'5px 14px',
        textAlign:iconSide==='right'?'right':'left',
        boxShadow:isActive?`0 0 12px ${glowColor}88`:'none',transition:'all 0.3s',
        minWidth:compact?'64px':undefined}}>
        <div style={{fontFamily:'Rajdhani',fontWeight:700,fontSize:compact?'9px':isTablet?'10px':'11px',color:'#fff',letterSpacing:'0.5px',whiteSpace:'nowrap'}}>{name}</div>
        <div style={{fontFamily:'Courier New,monospace',fontSize:compact?'22px':isTablet?'26px':'34px',fontWeight:900,color:'#fff',
          textShadow:`0 0 10px ${glowColor}`,lineHeight:1,
          animation:scoreAnim?`${side==='left'?'scorePopA':'scorePopB'} 0.4s ease`:'none'}}>{score}</div>
        <div style={{fontSize:compact?'9px':'10px',color:'rgba(255,255,255,0.6)',fontFamily:'Rajdhani',fontWeight:500}}>TARGET: {winningScore}</div>
      </div>
    </div>
  );
}

function Scoreboard({scoreA,scoreB,timeLeft,winningScore,activeTeam,subject,musicOn,onToggleMusic,scoreAnimA,scoreAnimB}){
  const{isMobile,isTablet}=useViewport();
  const compact=isMobile;
  const isLow=timeLeft<=5,isUrgent=timeLeft<=3;
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
      background:'linear-gradient(180deg,#2d1200 0%,#1a0900 100%)',
      borderBottom:'3px solid #8b5e00',
      padding:compact?'0 6px':isTablet?'0 8px':'0 12px',
      height:compact?'56px':isTablet?'64px':'72px',
      minHeight:compact?'56px':isTablet?'64px':'72px',
      flexShrink:0,position:'relative',boxShadow:'0 4px 20px rgba(0,0,0,0.8)'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',
        background:'linear-gradient(90deg,transparent,#ffd700,#ff6600,#ffd700,transparent)'}}/>
      <TeamPanel name={compact?'TIM A':'TIM A (MERAH)'} score={scoreA} side="left" color="#c0392b" glowColor="#ff4444"
        isActive={activeTeam==='A'} winningScore={winningScore} icon={<span style={{fontSize:compact?22:36}}>🦁</span>}
        iconSide="left" compact={compact} isTablet={isTablet} scoreAnim={scoreAnimA}/>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1px',
        minWidth:compact?'72px':isTablet?'110px':'150px',flexShrink:0}}>
        {!compact&&<div style={{fontSize:'9px',color:'#c8a45a',letterSpacing:'3px',fontFamily:'Rajdhani',fontWeight:600}}>WAKTU TERSISA</div>}
        <div style={{background:'radial-gradient(ellipse,#1a0800,#0d0400)',border:'2px solid #8b6914',
          borderRadius:'6px',padding:compact?'2px 8px':isTablet?'2px 12px':'3px 18px',
          boxShadow:'inset 0 0 15px rgba(0,0,0,0.8),0 0 12px rgba(255,140,0,0.3)',position:'relative'}}>
          {!compact&&['tl','tr','bl','br'].map((p,i)=>(
            <div key={i} style={{position:'absolute',width:'7px',height:'7px',
              borderTop:p.startsWith('t')?'2px solid #ffd700':'none',borderBottom:p.startsWith('b')?'2px solid #ffd700':'none',
              borderLeft:p.endsWith('l')?'2px solid #ffd700':'none',borderRight:p.endsWith('r')?'2px solid #ffd700':'none',
              top:p.startsWith('t')?'2px':'auto',bottom:p.startsWith('b')?'2px':'auto',
              left:p.endsWith('l')?'2px':'auto',right:p.endsWith('r')?'2px':'auto'}}/>
          ))}
          <div style={{fontFamily:'Courier New,monospace',fontSize:compact?'26px':isTablet?'30px':'38px',fontWeight:'bold',
            color:isUrgent?'#ff2200':isLow?'#ff8800':'#ffd700',
            textShadow:`0 0 15px ${isUrgent?'#ff2200':'#ffa500'}`,lineHeight:1,
            animation:isUrgent?'timerBlink 0.5s infinite':isLow?'timerBlink 1s infinite':'none',
            minWidth:compact?'36px':'56px',textAlign:'center'}}>
            {String(timeLeft).padStart(2,'0')}
          </div>
        </div>
        {!compact&&<div style={{fontSize:'9px',color:'#c8a45a',letterSpacing:'3px',fontFamily:'Rajdhani',fontWeight:600}}>DETIK</div>}
        {subject&&<div style={{fontSize:'8px',color:'#ffd700',letterSpacing:'1px',fontFamily:'Rajdhani',fontWeight:700,marginTop:'1px'}}>{subject.toUpperCase()}</div>}
        <button onClick={onToggleMusic} title={musicOn?'Matikan Musik':'Nyalakan Musik'}
          style={{background:'transparent',border:'none',cursor:'pointer',fontSize:'12px',opacity:0.6,padding:'0 2px',
            animation:musicOn?'musicPulse 2s ease infinite':'none',touchAction:'manipulation'}}>
          {musicOn?'🔊':'🔇'}
        </button>
      </div>
      <TeamPanel name={compact?'TIM B':'TIM B (BIRU)'} score={scoreB} side="right" color="#2471a3" glowColor="#4488ff"
        isActive={activeTeam==='B'} winningScore={winningScore} icon={<span style={{fontSize:compact?22:36}}>🦅</span>}
        iconSide="right" compact={compact} isTablet={isTablet} scoreAnim={scoreAnimB}/>
    </div>
  );
}

/* ── QUESTION PANEL ── */
function QTeamPanel({team,color,glowColor,label,icon,answers,selected,result,onAnswer,locked,flipped,compact}){
  const sz=compact?'12px':'13px',btnSz=compact?'34px':'38px';
  return(
    <div style={{background:`linear-gradient(135deg,${color}22,${color}11)`,
      border:`2px solid ${result==='correct'?'#00cc00':result==='wrong'?'#cc0000':color}44`,
      borderRadius:'10px',padding:compact?'6px':'8px',display:'flex',flexDirection:'column',gap:compact?'3px':'4px',
      transition:'all 0.3s',boxShadow:result==='correct'?'0 0 12px rgba(0,200,0,0.3)':result==='wrong'?'0 0 12px rgba(200,0,0,0.3)':'none',
      minWidth:compact?'80px':'120px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'5px',justifyContent:flipped?'flex-end':'flex-start',marginBottom:'2px'}}>
        {!flipped&&<span style={{fontSize:compact?'13px':'15px'}}>{icon}</span>}
        <span style={{fontFamily:'Rajdhani',fontWeight:700,fontSize:compact?'10px':'11px',color,letterSpacing:'0.5px',lineHeight:1}}>{label}</span>
        {flipped&&<span style={{fontSize:compact?'13px':'15px'}}>{icon}</span>}
      </div>
      {answers.map((_,i)=>(
        <button key={i} onClick={()=>!locked&&onAnswer(i)}
          style={{display:'flex',alignItems:'center',gap:'5px',justifyContent:flipped?'flex-end':'flex-start',
            padding:compact?'5px 7px':'6px 9px',
            background:selected===i?(result==='correct'?'rgba(0,180,0,0.3)':result==='wrong'?'rgba(180,0,0,0.3)':`${color}44`):'rgba(255,255,255,0.4)',
            border:`1.5px solid ${selected===i?(result==='correct'?'#00cc00':result==='wrong'?'#cc0000':color):'rgba(0,0,0,0.1)'}`,
            borderRadius:'6px',cursor:locked?'default':'pointer',fontFamily:'Rajdhani',fontWeight:600,
            fontSize:sz,color:'#1a1a1a',transition:'all 0.15s',opacity:locked&&selected!==i?0.55:1,
            transform:selected===i?'scale(1.02)':'scale(1)',touchAction:'manipulation',
            minHeight:'32px'}}>
          {flipped?(
            <><span style={{opacity:0.5,fontSize:'10px'}}>{OL[i]}</span>
            <div style={{background:OC[i],color:'white',borderRadius:'4px',width:'18px',height:'18px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,flexShrink:0}}>{OL[i]}</div></>
          ):(
            <><div style={{background:OC[i],color:'white',borderRadius:'4px',width:'18px',height:'18px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,flexShrink:0}}>{OL[i]}</div>
            <span style={{opacity:0.5,fontSize:'10px'}}>{OL[i]}</span></>
          )}
        </button>
      ))}
      <div style={{textAlign:'center',fontSize:compact?'10px':'11px',fontFamily:'Rajdhani',fontWeight:600,marginTop:'2px',
        color:result==='correct'?'#00aa00':result==='wrong'?'#cc0000':selected>=0?'#888':color}}>
        {result==='correct'?'✓ BENAR!':result==='wrong'?'✗ SALAH!':selected>=0?'⏳ Menunggu...':`⚡ Tim ${team}`}
      </div>
    </div>
  );
}

function QuestionPanel({question,answerA,answerB,onAnswerA,onAnswerB,resultA,resultB,isRevealing}){
  const{isMobile,isSmallTablet,isTablet,isLarge}=useViewport();
  const compact=isMobile||isSmallTablet;
  if(!question)return null;
  return(
    <div className="game-scroll" style={{background:'linear-gradient(180deg,#f5e6c8 0%,#ede0b8 100%)',
      borderTop:'3px solid #8b5e00',
      padding:compact?'6px 6px 8px':isTablet?'7px 8px':'9px 12px',
      position:'relative',boxShadow:'0 -4px 20px rgba(0,0,0,0.5)',
      flexShrink:0,overflowY:'auto',
      maxHeight:compact?'44dvh':isTablet?'42dvh':'40dvh',
      minHeight:compact?'160px':'0'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',
        background:'linear-gradient(90deg,transparent,#ffd700,#ff6600,#ffd700,transparent)'}}/>
      {/* Question Header */}
      <div style={{textAlign:'center',marginBottom:compact?'5px':'7px'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:'5px',color:'#1a4a8a',fontFamily:'Rajdhani',fontWeight:700,fontSize:compact?'10px':'11px',letterSpacing:compact?'0.5px':'1.5px'}}>
          <span style={{color:'#8b5e00'}}>❧</span>
          {question.type}
          <span style={{background:'#2471a3',color:'white',padding:'1px 5px',borderRadius:'9px',fontSize:compact?'9px':'10px'}}>({question.typeDesc})</span>
          <span style={{color:'#8b5e00'}}>❧</span>
        </div>
        <div style={{fontFamily:'Rajdhani',fontWeight:700,
          fontSize:compact?'14px':isTablet?'16px':isLarge?'19px':'17px',
          color:'#1a1a1a',letterSpacing:'0.5px',marginTop:'2px',lineHeight:1.25}}>
          {question.soal}
        </div>
        <div style={{width:'40px',height:'2px',background:'linear-gradient(90deg,transparent,#8b5e00,transparent)',margin:'3px auto 0'}}/>
      </div>

      {/* Mobile Layout: vertical stack per option with both team buttons */}
      {compact?(
        <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
          {question.options.map((opt,i)=>{
            const sA=answerA===i,sB=answerB===i;
            const bg=isRevealing&&i===question.answer?'rgba(0,180,0,0.12)':'rgba(255,255,255,0.5)';
            const border=isRevealing&&i===question.answer?'1.5px solid #00aa00':'1.5px solid rgba(0,0,0,0.1)';
            const btnABg=sA?(resultA==='correct'?'rgba(0,180,0,0.35)':resultA==='wrong'?'rgba(180,0,0,0.35)':'rgba(192,57,43,0.3)'):'rgba(192,57,43,0.1)';
            const btnBBg=sB?(resultB==='correct'?'rgba(0,180,0,0.35)':resultB==='wrong'?'rgba(180,0,0,0.35)':'rgba(36,113,163,0.3)'):'rgba(36,113,163,0.1)';
            const btnABorder=sA?(resultA==='correct'?'#00cc00':resultA==='wrong'?'#cc0000':'#c0392b'):'rgba(192,57,43,0.3)';
            const btnBBorder=sB?(resultB==='correct'?'#00cc00':resultB==='wrong'?'#cc0000':'#2471a3'):'rgba(36,113,163,0.3)';
            return(
              <div key={i} style={{display:'grid',gridTemplateColumns:'38px 1fr 38px',gap:'4px',alignItems:'center',
                background:bg,border,borderRadius:'7px',padding:'3px 4px',
                boxShadow:isRevealing&&i===question.answer?'0 0 6px rgba(0,180,0,0.25)':'none'}}>
                <button onClick={()=>!isRevealing&&answerA<0&&onAnswerA(i)}
                  style={{width:'38px',height:'38px',background:btnABg,border:`2px solid ${btnABorder}`,
                    borderRadius:'7px',cursor:isRevealing||answerA>=0?'default':'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:'17px',
                    opacity:isRevealing&&!sA?0.45:1,transition:'all 0.15s',
                    transform:sA?'scale(1.06)':'scale(1)',touchAction:'manipulation'}}>🦁</button>
                <div style={{display:'flex',alignItems:'center',gap:'5px',padding:'0 3px'}}>
                  <div style={{background:OC[i],color:'white',borderRadius:'4px',width:'20px',height:'20px',flexShrink:0,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700}}>{OL[i]}</div>
                  <span style={{fontFamily:'Rajdhani',fontWeight:600,fontSize:'12px',color:'#1a1a1a',lineHeight:1.2,flex:1}}>{opt}</span>
                  {isRevealing&&i===question.answer&&<span style={{fontSize:'11px'}}>✅</span>}
                </div>
                <button onClick={()=>!isRevealing&&answerB<0&&onAnswerB(i)}
                  style={{width:'38px',height:'38px',background:btnBBg,border:`2px solid ${btnBBorder}`,
                    borderRadius:'7px',cursor:isRevealing||answerB>=0?'default':'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:'17px',
                    opacity:isRevealing&&!sB?0.45:1,transition:'all 0.15s',
                    transform:sB?'scale(1.06)':'scale(1)',touchAction:'manipulation'}}>🦅</button>
              </div>
            );
          })}
          {/* Status */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5px',marginTop:'2px'}}>
            {[{team:'A',color:'#c0392b',sel:answerA,res:resultA},{team:'B',color:'#2471a3',sel:answerB,res:resultB}].map(({team,color,sel,res})=>(
              <div key={team} style={{textAlign:'center',fontSize:'10px',fontFamily:'Rajdhani',fontWeight:700,
                padding:'3px 5px',background:`${color}12`,borderRadius:'6px',border:`1px solid ${color}33`,
                color:res==='correct'?'#00aa00':res==='wrong'?'#cc0000':sel>=0?'#888':color}}>
                {res==='correct'?`✓ TIM ${team} BENAR!`:res==='wrong'?`✗ TIM ${team} SALAH`:sel>=0?`⏳ TIM ${team}...`:`⚡ TIM ${team}`}
              </div>
            ))}
          </div>
        </div>
      ):(
        /* Desktop Layout: 3 columns */
        <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:isTablet?'7px':isLarge?'18px':'10px',alignItems:'start'}}>
          <QTeamPanel team="A" color="#c0392b" glowColor="#ff4444" label="TIM A (MERAH)" icon="🦁"
            answers={question.options} selected={answerA} result={resultA} onAnswer={onAnswerA}
            locked={isRevealing||answerA>=0} compact={isTablet}/>
          <div style={{display:'flex',flexDirection:'column',gap:isTablet?'4px':'6px',
            minWidth:isTablet?'150px':isLarge?'260px':'185px'}}>
            {question.options.map((opt,i)=>{
              const hA=resultA!==null&&answerA===i,hB=resultB!==null&&answerB===i,cr=isRevealing&&i===question.answer;
              return(<div key={i} style={{display:'flex',alignItems:'center',gap:isTablet?'5px':'7px',
                padding:isTablet?'5px 7px':isLarge?'9px 14px':'6px 10px',
                background:cr?'rgba(0,180,0,0.18)':'rgba(255,255,255,0.5)',
                border:cr?'1.5px solid #00aa00':'1.5px solid rgba(0,0,0,0.1)',
                borderRadius:'8px',transition:'all 0.3s',boxShadow:cr?'0 0 8px rgba(0,180,0,0.25)':'none'}}>
                <div style={{background:OC[i],color:'white',borderRadius:'5px',
                  width:isTablet?'20px':isLarge?'28px':'22px',height:isTablet?'20px':isLarge?'28px':'22px',
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:isTablet?'10px':isLarge?'14px':'11px',fontWeight:700,flexShrink:0}}>{OL[i]}</div>
                <span style={{fontFamily:'Rajdhani',fontWeight:600,fontSize:isTablet?'12px':isLarge?'16px':'13px',color:'#1a1a1a',flex:1}}>{opt}</span>
                <div style={{display:'flex',gap:'2px'}}>
                  {hA&&<span style={{fontSize:'13px',filter:resultA==='correct'?'none':'grayscale(1) opacity(0.5)'}}>🦁</span>}
                  {hB&&<span style={{fontSize:'13px',filter:resultB==='correct'?'none':'grayscale(1) opacity(0.5)'}}>🦅</span>}
                  {cr&&<span style={{fontSize:'13px'}}>✅</span>}
                </div>
              </div>);
            })}
          </div>
          <QTeamPanel team="B" color="#2471a3" glowColor="#4488ff" label="TIM B (BIRU)" icon="🦅"
            answers={question.options} selected={answerB} result={resultB} onAnswer={onAnswerB}
            locked={isRevealing||answerB>=0} flipped compact={isTablet}/>
        </div>
      )}
      {isRevealing&&question.explanation&&(
        <div style={{marginTop:'6px',background:'rgba(0,80,0,0.08)',border:'1px solid rgba(0,120,0,0.2)',
          borderRadius:'7px',padding:compact?'4px 8px':'6px 10px',textAlign:'center',
          fontSize:compact?'11px':'12px',color:'#2d5a00',fontFamily:'Rajdhani',fontWeight:600,animation:'floatIn 0.4s ease'}}>
          📚 {question.explanation}
        </div>
      )}
    </div>
  );
}

/* ── KONFETI ── */
function Confetti(){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    c.width=window.innerWidth;c.height=window.innerHeight;
    const ctx=c.getContext('2d');
    const parts=Array.from({length:130},()=>({
      x:Math.random()*c.width,y:Math.random()*-c.height*0.6,
      w:Math.random()*10+4,h:Math.random()*6+3,
      c:['#ffd700','#ff4444','#4488ff','#44cc44','#ff8800','#cc44cc'][Math.floor(Math.random()*6)],
      vx:(Math.random()-.5)*3,vy:Math.random()*4+1.5,r:Math.random()*360,vr:(Math.random()-.5)*5,
    }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
        if(p.y>c.height)p.y=-20;
        ctx.save();ctx.translate(p.x+p.w/2,p.y+p.h/2);ctx.rotate(p.r*Math.PI/180);
        ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:999}}/>;
}

/* ── REVIEW HASIL ── */
function ReviewScreen({gameLog,subject,scoreA,scoreB,winningScore,onRestart,onHome}){
  const{isMobile}=useViewport();
  const compact=isMobile;
  const totalQ=gameLog.length;
  const benarA=gameLog.filter(l=>l.resultA==='correct').length;
  const benarB=gameLog.filter(l=>l.resultB==='correct').length;
  const winA=scoreA>=winningScore,winB=scoreB>=winningScore,draw=!winA&&!winB;
  return(
    <div style={{position:'fixed',inset:0,display:'flex',flexDirection:'column',
      background:'linear-gradient(180deg,#1a0900 0%,#0d0400 100%)',
      fontFamily:'Rajdhani,sans-serif',overflow:'hidden'}}>
      {/* Header */}
      <div style={{flexShrink:0,background:'linear-gradient(180deg,#3d1f00,#2d1200)',
        borderBottom:'3px solid #8b5e00',padding:compact?'10px 12px':'14px 24px'}}>
        <div style={{textAlign:'center',color:'#ffd700',fontSize:compact?'11px':'12px',letterSpacing:'2px',marginBottom:'3px',opacity:0.7}}>📋 REVIEW HASIL PERMAINAN</div>
        <div style={{textAlign:'center',color:'rgba(255,215,0,0.5)',fontSize:compact?'10px':'11px',marginBottom:'8px',letterSpacing:'1px'}}>
          {subject} · {totalQ} soal dijawab
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:compact?'6px':'12px',maxWidth:'480px',margin:'0 auto'}}>
          {[{icon:'🦁',name:'Tim Merah',score:scoreA,benar:benarA,win:winA,color:'#c0392b',glow:'#ff4444'},
            {icon:'🦅',name:'Tim Biru',score:scoreB,benar:benarB,win:winB,color:'#2471a3',glow:'#4488ff'}].map(t=>(
            <div key={t.name} style={{background:`${t.color}33`,border:`2px solid ${t.win?t.glow:t.color+'66'}`,
              borderRadius:'10px',padding:compact?'7px 10px':'9px 14px',textAlign:'center',
              boxShadow:t.win?`0 0 16px ${t.glow}66`:'none',
              animation:t.win?'victoryBounce 0.6s ease 0.3s both':'none'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',marginBottom:'3px'}}>
                <span style={{fontSize:compact?'16px':'20px'}}>{t.icon}</span>
                <span style={{color:'#fff',fontWeight:700,fontSize:compact?'12px':'14px'}}>{t.name}</span>
                {t.win&&<span style={{fontSize:compact?'14px':'16px'}}>👑</span>}
              </div>
              <div style={{color:'#fff',fontSize:compact?'22px':'28px',fontWeight:900,lineHeight:1,
                textShadow:`0 0 10px ${t.glow}`}}>{t.score}<span style={{fontSize:compact?'12px':'14px',opacity:0.6}}>/{winningScore}</span></div>
              <div style={{color:'rgba(255,255,255,0.55)',fontSize:compact?'10px':'11px',marginTop:'2px'}}>
                {t.benar}/{totalQ} benar · {totalQ>0?Math.round(t.benar/totalQ*100):0}% akurasi
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log list — scrollable */}
      <div className="review-scroll" style={{flex:1,overflowY:'auto',padding:compact?'8px 10px':'12px 20px',minHeight:0}}>
        <div style={{maxWidth:'700px',margin:'0 auto',display:'flex',flexDirection:'column',gap:compact?'6px':'8px'}}>
          {gameLog.map((log,idx)=>(
            <div key={idx} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,215,0,0.1)',
              borderRadius:'10px',padding:compact?'8px 10px':'10px 14px',
              display:'flex',flexDirection:'column',gap:'5px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'4px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px',flex:1,minWidth:0}}>
                  <span style={{background:'#8b6914',color:'#ffd700',borderRadius:'5px',padding:'2px 7px',
                    fontSize:compact?'9px':'10px',fontWeight:700,flexShrink:0}}>#{idx+1}</span>
                  <span style={{color:'rgba(255,215,0,0.5)',fontSize:compact?'9px':'10px',
                    textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap'}}>
                    {log.question?.type||subject} · {log.question?.typeDesc||''}
                  </span>
                </div>
                <div style={{display:'flex',gap:'5px',flexShrink:0}}>
                  <span style={{padding:compact?'2px 6px':'3px 8px',borderRadius:'12px',fontSize:compact?'9px':'10px',fontWeight:700,
                    background:log.resultA==='correct'?'rgba(0,150,0,0.35)':'rgba(150,0,0,0.3)',
                    color:log.resultA==='correct'?'#44ff88':'#ff6666',
                    border:`1px solid ${log.resultA==='correct'?'rgba(0,200,0,0.4)':'rgba(200,0,0,0.3)'}`}}>
                    🦁 {log.resultA==='correct'?'✓ Benar':'✗ Salah'}
                  </span>
                  <span style={{padding:compact?'2px 6px':'3px 8px',borderRadius:'12px',fontSize:compact?'9px':'10px',fontWeight:700,
                    background:log.resultB==='correct'?'rgba(0,150,0,0.35)':'rgba(150,0,0,0.3)',
                    color:log.resultB==='correct'?'#44ff88':'#ff6666',
                    border:`1px solid ${log.resultB==='correct'?'rgba(0,200,0,0.4)':'rgba(200,0,0,0.3)'}`}}>
                    🦅 {log.resultB==='correct'?'✓ Benar':'✗ Salah'}
                  </span>
                </div>
              </div>
              {/* Soal & jawaban */}
              <div style={{color:'rgba(255,255,255,0.82)',fontSize:compact?'11px':'12px',
                fontWeight:600,paddingLeft:'2px',lineHeight:1.3}}>
                {log.question?.soal||''}
              </div>
              {log.question?.options&&(
                <div style={{display:'flex',flexWrap:'wrap',gap:'4px',paddingLeft:'2px'}}>
                  {log.question.options.map((opt,i)=>{
                    const isCorrect=i===log.question.answer;
                    const pickedA=i===log.answerA;const pickedB=i===log.answerB;
                    if(!isCorrect&&!pickedA&&!pickedB)return null;
                    return(
                      <span key={i} style={{padding:'2px 7px',borderRadius:'8px',fontSize:compact?'9px':'10px',
                        background:isCorrect?'rgba(0,150,0,0.3)':'rgba(150,0,0,0.2)',
                        border:`1px solid ${isCorrect?'rgba(0,200,0,0.4)':'rgba(200,0,0,0.3)'}`,
                        color:isCorrect?'#88ffaa':'#ffaaaa'}}>
                        {OL[i]}. {opt}
                        {isCorrect?' ✓':''}
                        {pickedA&&!isCorrect?' 🦁':''}
                        {pickedB&&!isCorrect?' 🦅':''}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer buttons */}
      <div style={{flexShrink:0,padding:compact?'8px 12px 10px':' 10px 20px 14px',
        background:'rgba(0,0,0,0.6)',borderTop:'2px solid rgba(139,94,0,0.3)',
        display:'flex',gap:'8px'}}>
        <button onClick={onRestart} style={{flex:1,padding:compact?'11px':'13px',
          background:'linear-gradient(135deg,#c0392b,#962d22)',border:'2px solid #ff6644',
          borderRadius:'10px',color:'white',fontFamily:'Rajdhani',fontWeight:700,
          fontSize:compact?'13px':'15px',letterSpacing:'1px',cursor:'pointer',
          boxShadow:'0 4px 18px rgba(192,57,43,0.55)',touchAction:'manipulation'}}>
          ▶ MAIN LAGI
        </button>
        <button onClick={onHome} style={{flex:1,padding:compact?'11px':'13px',
          background:'rgba(255,255,255,0.08)',border:'2px solid rgba(255,255,255,0.2)',
          borderRadius:'10px',color:'rgba(255,255,255,0.85)',fontFamily:'Rajdhani',fontWeight:700,
          fontSize:compact?'13px':'15px',letterSpacing:'1px',cursor:'pointer',touchAction:'manipulation'}}>
          🏠 MENU UTAMA
        </button>
      </div>
    </div>
  );
}

/* ── LAYAR MAIN (GAME PLAYING) ── */
function PlayingScreen({teacher,onBack}){
  const{isMobile,isSmallTablet}=useViewport();
  const compact=isMobile||isSmallTablet;
  const questions=useRef(shuf([...(teacher.q||[])]));
  const qIndex=useRef(0);
  const[q,setQ]=useState(questions.current[0]||null);
  const[answerA,setAnswerA]=useState(-1);
  const[answerB,setAnswerB]=useState(-1);
  const[resultA,setResultA]=useState(null);
  const[resultB,setResultB]=useState(null);
  const[isRevealing,setIsRevealing]=useState(false);
  const[timeLeft,setTimeLeft]=useState(teacher.cfg?.time||15);
  const[scoreA,setScoreA]=useState(0);
  const[scoreB,setScoreB]=useState(0);
  const[ropePosition,setRopePosition]=useState(0);
  const[phase,setPhase]=useState('playing');// playing | gameover | review
  const[gameLog,setGameLog]=useState([]);
  const[animState,setAnimState]=useState({A:'idle',B:'idle'});
  const[musicOn,setMusicOn]=useState(false);
  const[scoreAnimA,setScoreAnimA]=useState(false);
  const[scoreAnimB,setScoreAnimB]=useState(false);
  const revealRef=useRef(false);
  const{startMusic,stopMusic}=useBgMusic();
  const winScore=teacher.cfg?.win||7;
  const activeTeam=answerA<0&&answerB<0?null:answerA>=0&&answerB<0?'A':answerB>=0&&answerA<0?'B':null;
  const logRef=useRef([]);

  // Keyboard
  useEffect(()=>{
    const fn=(e)=>{
      if(phase!=='playing'||isRevealing)return;
      const k=e.key;
      if(k==='1'&&answerA<0)doAnswer('A',0);
      else if(k==='2'&&answerA<0)doAnswer('A',1);
      else if(k==='3'&&answerA<0)doAnswer('A',2);
      else if(k==='4'&&answerA<0)doAnswer('A',3);
    };
    window.addEventListener('keydown',fn);
    return()=>window.removeEventListener('keydown',fn);
  },[phase,isRevealing,answerA]);// eslint-disable-line

  // Timer
  const timerRef=useRef(null);
  const timeRef=useRef(teacher.cfg?.time||15);
  useEffect(()=>{timeRef.current=timeLeft;},[timeLeft]);
  useEffect(()=>{
    if(phase!=='playing')return;
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){clearInterval(timerRef.current);handleTimeUp();return 0;}
        return t-1;
      });
    },1000);
    return()=>clearInterval(timerRef.current);
  },[phase]);// eslint-disable-line

  const handleTimeUp=useCallback(()=>{
    setIsRevealing(true);revealRef.current=true;
    setAnswerA(a=>a);setAnswerB(b=>b);
    setTimeout(()=>nextQuestion(true),RDUR);
  },[]);// eslint-disable-line

  const checkWin=(sA,sB,rope)=>{
    if(sA>=winScore||rope<=-winScore)return'A';
    if(sB>=winScore||rope>=winScore)return'B';
    return null;
  };

  const doAnswer=useCallback((team,idx)=>{
    if(isRevealing||revealRef.current)return;
    if(team==='A'&&answerA>=0)return;
    if(team==='B'&&answerB>=0)return;
    if(team==='A')setAnswerA(idx);
    else setAnswerB(idx);
  },[isRevealing,answerA,answerB]);

  // When both answered or one answered: check & reveal
  useEffect(()=>{
    if(isRevealing||revealRef.current)return;
    const bothAnswered=answerA>=0&&answerB>=0;
    if(!bothAnswered)return;
    clearInterval(timerRef.current);
    revealRef.current=true;setIsRevealing(true);
    const crA=answerA===q?.answer;const crB=answerB===q?.answer;
    setResultA(crA?'correct':'wrong');setResultB(crB?'correct':'wrong');
    let newSA=scoreA,newSB=scoreB,newRope=ropePosition;
    if(crA){newSA++;setScoreA(newSA);setScoreAnimA(true);setTimeout(()=>setScoreAnimA(false),500);}
    if(crB){newSB++;setScoreB(newSB);setScoreAnimB(true);setTimeout(()=>setScoreAnimB(false),500);}
    if(crA&&!crB){newRope--;setRopePosition(newRope);setAnimState({A:'pulling',B:'stumbling'});}
    else if(crB&&!crA){newRope++;setRopePosition(newRope);setAnimState({A:'stumbling',B:'pulling'});}
    else{setAnimState({A:'idle',B:'idle'});}
    const winner=checkWin(newSA,newSB,newRope);
    logRef.current=[...logRef.current,{question:{...q},answerA,answerB,resultA:crA?'correct':'wrong',resultB:crB?'correct':'wrong'}];
    setGameLog([...logRef.current]);
    if(winner){
      setAnimState({A:winner==='A'?'victory':'stumbling',B:winner==='B'?'victory':'stumbling'});
      setTimeout(()=>{clearInterval(timerRef.current);setPhase('gameover');},RDUR);
    }else{
      setTimeout(()=>nextQuestion(false),RDUR);
    }
  },[answerA,answerB]);// eslint-disable-line

  const nextQuestion=useCallback((fromTimer=false)=>{
    revealRef.current=false;setIsRevealing(false);
    setResultA(null);setResultB(null);
    setAnswerA(-1);setAnswerB(-1);
    setAnimState({A:'idle',B:'idle'});
    qIndex.current++;
    if(qIndex.current>=questions.current.length){questions.current=shuf([...(teacher.q||[])]);qIndex.current=0;}
    const nq=questions.current[qIndex.current];
    setQ(nq);
    setTimeLeft(teacher.cfg?.time||15);
  },[teacher]);// eslint-disable-line

  const handleRestart=()=>{
    questions.current=shuf([...(teacher.q||[])]);qIndex.current=0;
    setQ(questions.current[0]);
    setAnswerA(-1);setAnswerB(-1);setResultA(null);setResultB(null);
    setIsRevealing(false);revealRef.current=false;
    setTimeLeft(teacher.cfg?.time||15);
    setScoreA(0);setScoreB(0);setRopePosition(0);
    setPhase('playing');logRef.current=[];setGameLog([]);
    setAnimState({A:'idle',B:'idle'});
  };

  if(phase==='gameover'||phase==='review'){
    const winner=checkWin(scoreA,scoreB,ropePosition);
    const winnerName=winner==='A'?'TIM A (MERAH)':winner==='B'?'TIM B (BIRU)':'SERI';
    return(
      <div style={{position:'fixed',inset:0,display:'flex',flexDirection:'column',
        background:'linear-gradient(135deg,#1a0900 0%,#0d0400 100%)',fontFamily:'Rajdhani,sans-serif',overflow:'hidden'}}>
        {winner&&<Confetti/>}
        {phase==='gameover'&&(
          <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
            gap:compact?'10px':'14px',padding:compact?'16px':'24px',overflowY:'auto'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:compact?'44px':'60px',animation:'victoryBounce 0.6s ease',
                filter:`drop-shadow(0 0 20px ${winner==='A'?'#ff4444':winner==='B'?'#4488ff':'#ffd700'})`}}>
                {winner==='A'?'🦁':winner==='B'?'🦅':'🤝'}
              </div>
              <div style={{color:'#ffd700',fontFamily:'Rajdhani',fontWeight:900,
                fontSize:compact?'22px':'32px',letterSpacing:'3px',
                textShadow:'0 0 20px rgba(255,215,0,0.8)',animation:'pulseGold 1s infinite',marginTop:'4px'}}>
                {winner?`${winnerName} MENANG!`:'SERI!'}
              </div>
            </div>
            {/* Scores */}
            <div style={{display:'flex',gap:compact?'10px':'16px',alignItems:'center'}}>
              {[{t:'A',s:scoreA,c:'#c0392b',g:'#ff4444',i:'🦁',w:winner==='A'},
                {t:'B',s:scoreB,c:'#2471a3',g:'#4488ff',i:'🦅',w:winner==='B'}].map(({t,s,c,g,i,w})=>(
                <div key={t} style={{background:`${c}33`,border:`2px solid ${w?g:c+'66'}`,borderRadius:'12px',
                  padding:compact?'10px 16px':'14px 22px',textAlign:'center',
                  boxShadow:w?`0 0 20px ${g}66`:'none',animation:w?'victoryBounce 0.6s ease 0.2s both':'none'}}>
                  <div style={{fontSize:compact?'26px':'36px'}}>{i}</div>
                  <div style={{color:'#fff',fontWeight:700,fontSize:compact?'11px':'13px',opacity:0.8}}>{`TIM ${t}`}</div>
                  <div style={{color:'#fff',fontSize:compact?'28px':'38px',fontWeight:900,textShadow:`0 0 12px ${g}`,lineHeight:1}}>
                    {s}<span style={{fontSize:compact?'13px':'16px',opacity:0.5}}>/{winScore}</span>
                  </div>
                  {w&&<div style={{fontSize:compact?'16px':'20px',marginTop:'2px'}}>👑</div>}
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:'8px',width:'100%',maxWidth:'380px'}}>
              <button onClick={()=>setPhase('review')} style={{flex:1,padding:compact?'11px':'13px',
                background:'rgba(255,215,0,0.12)',border:'2px solid #ffd700',borderRadius:'10px',
                color:'#ffd700',fontFamily:'Rajdhani',fontWeight:700,fontSize:compact?'12px':'14px',cursor:'pointer',touchAction:'manipulation'}}>
                📋 LIHAT REVIEW
              </button>
              <button onClick={handleRestart} style={{flex:1,padding:compact?'11px':'13px',
                background:'linear-gradient(135deg,#c0392b,#962d22)',border:'2px solid #ff6644',
                borderRadius:'10px',color:'white',fontFamily:'Rajdhani',fontWeight:700,fontSize:compact?'12px':'14px',cursor:'pointer',touchAction:'manipulation'}}>
                ▶ MAIN LAGI
              </button>
            </div>
            <button onClick={onBack} style={{padding:compact?'9px 20px':'10px 24px',background:'rgba(255,255,255,0.06)',
              border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'rgba(255,255,255,0.7)',
              fontFamily:'Rajdhani',fontWeight:600,fontSize:compact?'11px':'13px',cursor:'pointer',touchAction:'manipulation'}}>
              🏠 Menu Utama
            </button>
          </div>
        )}
        {phase==='review'&&(
          <ReviewScreen gameLog={gameLog} subject={teacher.subject} scoreA={scoreA} scoreB={scoreB}
            winningScore={winScore} onRestart={handleRestart} onHome={onBack}/>
        )}
      </div>
    );
  }

  if(!q)return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100dvh',color:'#fff',fontFamily:'Rajdhani',flexDirection:'column',gap:'12px'}}>
      <div style={{fontSize:'40px'}}>⚠️</div>
      <div style={{fontSize:'18px'}}>Soal belum dikonfigurasi untuk mata pelajaran ini.</div>
      <button onClick={onBack} style={{marginTop:'8px',padding:'10px 22px',background:'#c0392b',border:'none',borderRadius:'8px',color:'white',fontSize:'15px',fontFamily:'Rajdhani',fontWeight:700,cursor:'pointer'}}>Kembali</button>
    </div>
  );

  return(
    <div style={{width:'100vw',height:'100dvh',display:'flex',flexDirection:'column',overflow:'hidden',fontFamily:'Rajdhani,sans-serif',background:'#1a0900'}}>
      <Scoreboard scoreA={scoreA} scoreB={scoreB} timeLeft={timeLeft} winningScore={winScore}
        activeTeam={activeTeam} subject={teacher.subject}
        musicOn={musicOn} onToggleMusic={()=>{musicOn?stopMusic():startMusic();setMusicOn(m=>!m);}}
        scoreAnimA={scoreAnimA} scoreAnimB={scoreAnimB}/>
      {compact&&(
        <div style={{flexShrink:0,background:'rgba(0,0,0,0.5)',padding:'3px 8px',
          display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(139,94,0,0.3)'}}>
          <span style={{fontSize:'9px',color:'rgba(255,165,0,0.7)',fontFamily:'Rajdhani',fontWeight:600}}>🦁 Tim A: tekan opsi kiri</span>
          <span style={{fontSize:'9px',color:'rgba(255,165,0,0.7)',fontFamily:'Rajdhani',fontWeight:600}}>Tim B: tekan opsi kanan 🦅</span>
        </div>
      )}
      {!compact&&(
        <div style={{flexShrink:0,background:'rgba(0,0,0,0.45)',padding:'2px 12px',
          display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(139,94,0,0.2)'}}>
          <span style={{fontSize:'10px',color:'rgba(255,165,0,0.65)',fontFamily:'Rajdhani',fontWeight:600}}>🦁 Tim A: Tekan 1 / 2 / 3 / 4</span>
          <span style={{fontSize:'10px',color:'rgba(255,165,0,0.65)',fontFamily:'Rajdhani',fontWeight:600,cursor:'pointer'}} onClick={onBack}>← Kembali</span>
        </div>
      )}
      <Arena ropePosition={ropePosition} animState={animState}/>
      <QuestionPanel question={q} answerA={answerA} answerB={answerB}
        onAnswerA={(i)=>doAnswer('A',i)} onAnswerB={(i)=>doAnswer('B',i)}
        resultA={resultA} resultB={resultB} isRevealing={isRevealing}/>
    </div>
  );
}

/* ── LAYAR LOGIN ── */
function LoginScreen({teachers,onLogin}){
  const{isMobile}=useViewport();
  const compact=isMobile;
  const[user,setUser]=useState('');
  const[pass,setPass]=useState('');
  const[err,setErr]=useState('');
  const[loading,setLoading]=useState(false);
  const handleLogin=(e)=>{
    e.preventDefault();setErr('');setLoading(true);
    setTimeout(()=>{
      const t=Object.values(teachers).find(x=>x.id===user||x.name===user);
      if(!t){setErr('Akun tidak ditemukan.');setLoading(false);return;}
      if(t.pass!==pass){setErr('Password salah.');setLoading(false);return;}
      onLogin(t);
    },400);
  };
  const quickLogins=Object.values(teachers).filter(t=>t.id!=='admin');
  return(
    <div style={{width:'100vw',height:'100dvh',display:'flex',flexDirection:'column',alignItems:'center',
      justifyContent:'center',background:'linear-gradient(135deg,#1a0900 0%,#2d1200 50%,#1a0900 100%)',
      fontFamily:'Rajdhani,sans-serif',padding:'16px',overflowY:'auto'}}>
      <div style={{background:'rgba(255,255,255,0.04)',border:'2px solid rgba(255,215,0,0.25)',
        borderRadius:'16px',padding:compact?'20px 16px':'28px 32px',width:'100%',maxWidth:'400px',
        boxShadow:'0 20px 60px rgba(0,0,0,0.7)'}}>
        <div style={{textAlign:'center',marginBottom:'20px'}}>
          <div style={{fontSize:compact?'36px':'44px',marginBottom:'6px'}}>🏆</div>
          <div style={{color:'#ffd700',fontSize:compact?'18px':'22px',fontWeight:900,letterSpacing:'2px'}}>TARIK TAMBANG</div>
          <div style={{color:'rgba(255,255,255,0.45)',fontSize:compact?'10px':'11px',marginTop:'4px',letterSpacing:'1px'}}>Media Pembelajaran Interaktif</div>
        </div>
        <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          <div>
            <label style={{color:'rgba(255,215,0,0.6)',fontSize:'11px',letterSpacing:'1px',display:'block',marginBottom:'4px'}}>ID / NAMA GURU</label>
            <input value={user} onChange={e=>{setUser(e.target.value);setErr('');}}
              placeholder="Contoh: bj, math, ipa..."
              style={{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,0.06)',
                border:'1.5px solid rgba(255,215,0,0.2)',borderRadius:'8px',color:'#fff',
                fontFamily:'Rajdhani',fontSize:'14px',fontWeight:600}}/>
          </div>
          <div>
            <label style={{color:'rgba(255,215,0,0.6)',fontSize:'11px',letterSpacing:'1px',display:'block',marginBottom:'4px'}}>PASSWORD</label>
            <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr('');}}
              placeholder="Password..."
              style={{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,0.06)',
                border:'1.5px solid rgba(255,215,0,0.2)',borderRadius:'8px',color:'#fff',
                fontFamily:'Rajdhani',fontSize:'14px',fontWeight:600}}/>
          </div>
          {err&&<div style={{color:'#ff6666',fontSize:'12px',textAlign:'center',padding:'6px',background:'rgba(200,0,0,0.1)',borderRadius:'6px'}}>{err}</div>}
          <button type="submit" disabled={loading}
            style={{padding:'12px',background:'linear-gradient(135deg,#c0392b,#962d22)',
              border:'2px solid #ff6644',borderRadius:'10px',color:'white',fontFamily:'Rajdhani',
              fontWeight:700,fontSize:'15px',cursor:'pointer',letterSpacing:'1px',
              opacity:loading?0.7:1,transition:'opacity 0.2s',touchAction:'manipulation'}}>
            {loading?'Memuat...':'🔑 MASUK'}
          </button>
        </form>
        {/* Quick login */}
        <div style={{marginTop:'16px',borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:'14px'}}>
          <div style={{color:'rgba(255,255,255,0.3)',fontSize:'10px',textAlign:'center',marginBottom:'8px',letterSpacing:'1px'}}>LOGIN CEPAT</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:'6px'}}>
            {quickLogins.map(t=>(
              <button key={t.id} onClick={()=>onLogin(t)}
                style={{padding:'7px 6px',background:`${t.color}22`,border:`1.5px solid ${t.color}55`,
                  borderRadius:'8px',color:'rgba(255,255,255,0.75)',cursor:'pointer',fontFamily:'Rajdhani',
                  fontWeight:600,fontSize:'11px',display:'flex',alignItems:'center',gap:'4px',
                  justifyContent:'center',touchAction:'manipulation'}}>
                <span style={{fontSize:'13px'}}>{t.icon}</span>
                <span style={{textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap'}}>{t.subject}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── DASHBOARD ADMIN ── */
function AdminDashboard({teachers,onSave,onBack}){
  const{isMobile}=useViewport();const compact=isMobile;
  const[selected,setSelected]=useState(null);
  const[editMode,setEditMode]=useState('list');// list | subject | addq
  const[editTeacher,setEditTeacher]=useState(null);
  const[newQ,setNewQ]=useState({type:'',typeDesc:'',soal:'',options:['','','',''],answer:0,explanation:''});
  const[msg,setMsg]=useState('');
  const nonAdmin=Object.values(teachers).filter(t=>t.id!=='admin');

  const showMsg=(m)=>{setMsg(m);setTimeout(()=>setMsg(''),2800);};

  const saveTeacher=(id,updates)=>{
    const updated={...teachers,[id]:{...teachers[id],...updates}};
    onSave(updated);showMsg('✅ Tersimpan!');
  };
  const addQuestion=()=>{
    if(!newQ.soal.trim()||newQ.options.some(o=>!o.trim())){showMsg('⚠️ Lengkapi semua field soal!');return;}
    const id=Date.now();
    const q={...newQ,id};
    const updated={...teachers,[selected]:{...teachers[selected],q:[...(teachers[selected].q||[]),q]}};
    onSave(updated);showMsg('✅ Soal ditambahkan!');
    setNewQ({type:teachers[selected]?.subject||'',typeDesc:'',soal:'',options:['','','',''],answer:0,explanation:''});
  };
  const removeQuestion=(tid,qid)=>{
    const updated={...teachers,[tid]:{...teachers[tid],q:teachers[tid].q.filter(x=>x.id!==qid)}};
    onSave(updated);showMsg('🗑️ Soal dihapus!');
  };
  const resetDefaults=()=>{
    if(window.confirm('Reset semua soal ke default?')){onSave(INIT_TEACHERS);showMsg('🔄 Reset berhasil!');}
  };

  if(editMode==='subject'&&selected&&editTeacher){
    const t=teachers[selected];
    return(
      <div style={{width:'100vw',height:'100dvh',display:'flex',flexDirection:'column',
        background:'#1a0900',fontFamily:'Rajdhani,sans-serif',overflow:'hidden'}}>
        <div style={{flexShrink:0,background:'linear-gradient(180deg,#3d1f00,#2d1200)',borderBottom:'3px solid #8b5e00',padding:'10px 14px',display:'flex',alignItems:'center',gap:'10px'}}>
          <button onClick={()=>{setEditMode('list');setEditTeacher(null);}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'6px',color:'white',padding:'6px 12px',fontFamily:'Rajdhani',fontWeight:600,fontSize:'12px',cursor:'pointer'}}>← Kembali</button>
          <div style={{color:'#ffd700',fontWeight:700,fontSize:compact?'14px':'16px'}}>✏️ Edit: {t.name}</div>
          {msg&&<div style={{marginLeft:'auto',color:'#88ff88',fontSize:'12px',fontWeight:700}}>{msg}</div>}
        </div>
        <div className="review-scroll" style={{flex:1,overflowY:'auto',padding:compact?'10px 10px':'14px 20px',minHeight:0}}>
          <div style={{maxWidth:'680px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'10px'}}>
            {/* Config */}
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,215,0,0.15)',borderRadius:'10px',padding:compact?'10px':'14px'}}>
              <div style={{color:'#ffd700',fontSize:'12px',fontWeight:700,marginBottom:'10px',letterSpacing:'1px'}}>⚙️ KONFIGURASI PERMAINAN</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                {[{label:'Waktu per Soal (detik)',key:'time',min:5,max:60},{label:'Target Skor Menang',key:'win',min:3,max:15}].map(({label,key,min,max})=>(
                  <div key={key}>
                    <label style={{color:'rgba(255,255,255,0.5)',fontSize:'10px',display:'block',marginBottom:'4px'}}>{label}</label>
                    <input type="number" min={min} max={max}
                      defaultValue={t.cfg?.[key]||15}
                      onChange={e=>setEditTeacher(prev=>({...prev,cfg:{...prev.cfg,[key]:Number(e.target.value)}}))}
                      style={{width:'100%',padding:'7px 10px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,215,0,0.2)',borderRadius:'6px',color:'#fff',fontFamily:'Rajdhani',fontSize:'14px'}}/>
                  </div>
                ))}
              </div>
              <div style={{marginTop:'8px'}}>
                <label style={{color:'rgba(255,255,255,0.5)',fontSize:'10px',display:'block',marginBottom:'4px'}}>Password</label>
                <input defaultValue={t.pass}
                  onChange={e=>setEditTeacher(prev=>({...prev,pass:e.target.value}))}
                  style={{width:'100%',padding:'7px 10px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,215,0,0.2)',borderRadius:'6px',color:'#fff',fontFamily:'Rajdhani',fontSize:'14px'}}/>
              </div>
              <button onClick={()=>saveTeacher(selected,{cfg:editTeacher.cfg,pass:editTeacher.pass})}
                style={{marginTop:'10px',padding:'8px 18px',background:'linear-gradient(135deg,#27ae60,#1e8449)',border:'none',borderRadius:'8px',color:'white',fontFamily:'Rajdhani',fontWeight:700,fontSize:'13px',cursor:'pointer'}}>
                💾 Simpan Config
              </button>
            </div>
            {/* Tambah soal */}
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,215,0,0.15)',borderRadius:'10px',padding:compact?'10px':'14px'}}>
              <div style={{color:'#ffd700',fontSize:'12px',fontWeight:700,marginBottom:'10px',letterSpacing:'1px'}}>➕ TAMBAH SOAL BARU</div>
              {[{label:'Tipe Soal',key:'type',ph:'Contoh: Matematika'},{label:'Sub-tipe',key:'typeDesc',ph:'Contoh: Perkalian'},{label:'Pertanyaan',key:'soal',ph:'Tulis soal di sini...'}].map(({label,key,ph})=>(
                <div key={key} style={{marginBottom:'7px'}}>
                  <label style={{color:'rgba(255,255,255,0.5)',fontSize:'10px',display:'block',marginBottom:'3px'}}>{label}</label>
                  <input value={newQ[key]} onChange={e=>setNewQ(p=>({...p,[key]:e.target.value}))} placeholder={ph}
                    style={{width:'100%',padding:'7px 10px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,215,0,0.2)',borderRadius:'6px',color:'#fff',fontFamily:'Rajdhani',fontSize:'13px'}}/>
                </div>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginBottom:'7px'}}>
                {newQ.options.map((op,i)=>(
                  <div key={i}>
                    <label style={{color:'rgba(255,255,255,0.5)',fontSize:'10px',display:'block',marginBottom:'3px'}}>Pilihan {OL[i]}</label>
                    <input value={op} onChange={e=>{const opts=[...newQ.options];opts[i]=e.target.value;setNewQ(p=>({...p,options:opts}));}} placeholder={`Pilihan ${OL[i]}`}
                      style={{width:'100%',padding:'7px 8px',background:'rgba(255,255,255,0.06)',border:`1px solid ${OC[i]}44`,borderRadius:'6px',color:'#fff',fontFamily:'Rajdhani',fontSize:'12px'}}/>
                  </div>
                ))}
              </div>
              <div style={{marginBottom:'7px'}}>
                <label style={{color:'rgba(255,255,255,0.5)',fontSize:'10px',display:'block',marginBottom:'3px'}}>Jawaban Benar</label>
                <select value={newQ.answer} onChange={e=>setNewQ(p=>({...p,answer:Number(e.target.value)}))}
                  style={{width:'100%',padding:'7px 10px',background:'#1a0900',border:'1px solid rgba(255,215,0,0.2)',borderRadius:'6px',color:'#ffd700',fontFamily:'Rajdhani',fontSize:'13px'}}>
                  {OL.map((l,i)=><option key={i} value={i}>Pilihan {l}</option>)}
                </select>
              </div>
              <div style={{marginBottom:'10px'}}>
                <label style={{color:'rgba(255,255,255,0.5)',fontSize:'10px',display:'block',marginBottom:'3px'}}>Penjelasan (opsional)</label>
                <input value={newQ.explanation} onChange={e=>setNewQ(p=>({...p,explanation:e.target.value}))} placeholder="Penjelasan jawaban..."
                  style={{width:'100%',padding:'7px 10px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,215,0,0.2)',borderRadius:'6px',color:'#fff',fontFamily:'Rajdhani',fontSize:'13px'}}/>
              </div>
              <button onClick={addQuestion}
                style={{padding:'9px 20px',background:'linear-gradient(135deg,#2471a3,#1a5276)',border:'none',borderRadius:'8px',color:'white',fontFamily:'Rajdhani',fontWeight:700,fontSize:'13px',cursor:'pointer'}}>
                ➕ Tambah Soal
              </button>
            </div>
            {/* List soal */}
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,215,0,0.15)',borderRadius:'10px',padding:compact?'10px':'14px'}}>
              <div style={{color:'#ffd700',fontSize:'12px',fontWeight:700,marginBottom:'10px',letterSpacing:'1px'}}>
                📝 DAFTAR SOAL ({t.q?.length||0} soal)
              </div>
              {(t.q||[]).length===0&&<div style={{color:'rgba(255,255,255,0.3)',fontSize:'12px',textAlign:'center',padding:'20px 0'}}>Belum ada soal.</div>}
              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                {(t.q||[]).map((sq,i)=>(
                  <div key={sq.id||i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'8px',padding:'8px 10px',display:'flex',alignItems:'flex-start',gap:'8px'}}>
                    <span style={{background:'#8b6914',color:'#ffd700',borderRadius:'4px',padding:'2px 6px',fontSize:'9px',flexShrink:0,marginTop:'2px'}}>#{i+1}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{color:'rgba(255,255,255,0.8)',fontSize:'12px',fontWeight:600,lineHeight:1.3}}>{sq.soal}</div>
                      <div style={{color:'rgba(255,255,255,0.35)',fontSize:'10px',marginTop:'2px'}}>{sq.type} · Jawaban: {OL[sq.answer]}</div>
                    </div>
                    <button onClick={()=>removeQuestion(selected,sq.id||i)}
                      style={{background:'rgba(180,0,0,0.2)',border:'1px solid rgba(200,0,0,0.3)',borderRadius:'5px',color:'#ff6666',padding:'4px 8px',fontSize:'10px',cursor:'pointer',flexShrink:0,fontFamily:'Rajdhani',fontWeight:600}}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{width:'100vw',height:'100dvh',display:'flex',flexDirection:'column',
      background:'#1a0900',fontFamily:'Rajdhani,sans-serif',overflow:'hidden'}}>
      <div style={{flexShrink:0,background:'linear-gradient(180deg,#3d1f00,#2d1200)',borderBottom:'3px solid #8b5e00',padding:'10px 14px',display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
        <button onClick={onBack} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'6px',color:'white',padding:'6px 12px',fontFamily:'Rajdhani',fontWeight:600,fontSize:'12px',cursor:'pointer'}}>← Logout</button>
        <div style={{color:'#ffd700',fontWeight:700,fontSize:compact?'15px':'18px'}}>⚙️ Panel Admin</div>
        <button onClick={resetDefaults} style={{marginLeft:'auto',background:'rgba(255,100,0,0.15)',border:'1px solid rgba(255,100,0,0.3)',borderRadius:'6px',color:'#ffaa66',padding:'5px 10px',fontFamily:'Rajdhani',fontWeight:600,fontSize:'11px',cursor:'pointer'}}>🔄 Reset Default</button>
        {msg&&<div style={{color:'#88ff88',fontSize:'12px',fontWeight:700,width:'100%'}}>{msg}</div>}
      </div>
      <div className="review-scroll" style={{flex:1,overflowY:'auto',padding:compact?'10px':'16px',minHeight:0}}>
        <div style={{maxWidth:'700px',margin:'0 auto',display:'grid',gridTemplateColumns:compact?'1fr':'1fr 1fr',gap:'10px'}}>
          {nonAdmin.map(t=>(
            <div key={t.id} style={{background:`${t.color}18`,border:`2px solid ${t.color}44`,borderRadius:'12px',padding:compact?'10px 12px':'12px 16px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                <span style={{fontSize:compact?'20px':'24px'}}>{t.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:'#fff',fontWeight:700,fontSize:compact?'13px':'15px',lineHeight:1}}>{t.name}</div>
                  <div style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',marginTop:'1px'}}>{t.q?.length||0} soal · Target: {t.cfg?.win||7} poin</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{color:'rgba(255,255,255,0.4)',fontSize:'10px'}}>ID: {t.id}</div>
                  <div style={{color:'rgba(255,255,255,0.3)',fontSize:'9px'}}>Pass: {t.pass}</div>
                </div>
              </div>
              <button onClick={()=>{setSelected(t.id);setEditTeacher({...t});setEditMode('subject');}}
                style={{width:'100%',padding:'7px',background:`${t.color}33`,border:`1px solid ${t.color}66`,borderRadius:'7px',color:'#fff',fontFamily:'Rajdhani',fontWeight:700,fontSize:'12px',cursor:'pointer',touchAction:'manipulation'}}>
                ✏️ Edit Soal & Pengaturan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── LAYAR UTAMA / START ── */
function StartScreen({teacher,onStart,onAdmin,onLogout,isMobile}){
  const compact=isMobile;
  const isAdmin=teacher?.id==='admin';
  return(
    <div style={{width:'100vw',height:'100dvh',display:'flex',flexDirection:'column',alignItems:'center',
      justifyContent:'center',background:'linear-gradient(135deg,#1a0900 0%,#2d1200 50%,#1a0900 100%)',
      fontFamily:'Rajdhani,sans-serif',padding:'16px',overflowY:'auto',gap:compact?'12px':'16px',
      position:'relative'}}>
      {/* Decorative circles */}
      {[{s:300,op:0.03,t:'-60px',l:'-80px'},{s:200,op:0.04,t:'auto',l:'auto',b:'-40px',r:'-50px'}].map((c,i)=>(
        <div key={i} style={{position:'absolute',width:c.s,height:c.s,borderRadius:'50%',
          border:'2px solid rgba(255,215,0,0.15)',opacity:c.op,top:c.t,left:c.l,bottom:c.b,right:c.r,pointerEvents:'none'}}/>
      ))}
      <div style={{position:'absolute',top:'12px',right:'12px',display:'flex',gap:'6px'}}>
        {teacher?.id==='admin'&&<button onClick={onAdmin} style={{padding:'6px 12px',background:'rgba(255,165,0,0.1)',border:'1px solid rgba(255,165,0,0.3)',borderRadius:'7px',color:'#ffaa44',fontFamily:'Rajdhani',fontWeight:600,fontSize:'11px',cursor:'pointer'}}>⚙️ Admin</button>}
        <button onClick={onLogout} style={{padding:'6px 12px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'7px',color:'rgba(255,255,255,0.5)',fontFamily:'Rajdhani',fontWeight:600,fontSize:'11px',cursor:'pointer'}}>🚪 Logout</button>
      </div>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:compact?'56px':'72px',filter:'drop-shadow(0 0 30px rgba(255,215,0,0.4))',marginBottom:'4px'}}>🏆</div>
        <div style={{color:'#ffd700',fontWeight:900,fontSize:compact?'22px':'30px',letterSpacing:'3px',textShadow:'0 0 20px rgba(255,215,0,0.6)'}}>TARIK TAMBANG</div>
        <div style={{color:'rgba(255,255,255,0.45)',fontSize:compact?'10px':'12px',marginTop:'4px',letterSpacing:'1px'}}>Media Pembelajaran Interaktif</div>
      </div>
      {teacher&&!isAdmin&&(
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,215,0,0.2)',
          borderRadius:'12px',padding:compact?'12px 16px':'16px 24px',textAlign:'center',
          maxWidth:'360px',width:'100%'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'6px'}}>
            <span style={{fontSize:compact?'22px':'28px'}}>{teacher.icon}</span>
            <div>
              <div style={{color:'#fff',fontWeight:700,fontSize:compact?'14px':'17px'}}>{teacher.name}</div>
              <div style={{color:'rgba(255,255,255,0.45)',fontSize:compact?'10px':'11px'}}>{teacher.subject}</div>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:'16px',fontSize:compact?'11px':'12px',color:'rgba(255,255,255,0.4)',marginTop:'4px'}}>
            <span>⏱️ {teacher.cfg?.time||15}s per soal</span>
            <span>🎯 Target: {teacher.cfg?.win||7} poin</span>
            <span>📝 {teacher.q?.length||0} soal</span>
          </div>
        </div>
      )}
      {/* Teams preview */}
      <div style={{display:'flex',alignItems:'center',gap:compact?'12px':'20px'}}>
        {[{i:'🦁',n:'TIM A',c:'#c0392b',g:'#ff4444'},{i:'🦅',n:'TIM B',c:'#2471a3',g:'#4488ff'}].map((t,i)=>(
          <div key={i} style={{textAlign:'center'}}>
            <div style={{fontSize:compact?'38px':'52px',filter:`drop-shadow(0 0 16px ${t.g})`}}>{t.i}</div>
            <div style={{color:t.g,fontWeight:900,fontSize:compact?'11px':'13px',letterSpacing:'1px',marginTop:'2px'}}>{t.n}</div>
          </div>
        ))}
      </div>
      {!isAdmin&&(
        <button onClick={onStart}
          style={{padding:compact?'14px 40px':'16px 56px',background:'linear-gradient(135deg,#c0392b,#962d22)',
            border:'3px solid #ff6644',borderRadius:'14px',color:'white',fontFamily:'Rajdhani',
            fontWeight:900,fontSize:compact?'18px':'22px',cursor:'pointer',letterSpacing:'2px',
            boxShadow:'0 6px 30px rgba(192,57,43,0.6)',touchAction:'manipulation',
            animation:'pulseGold 2s infinite'}}>
          ▶ MULAI BERMAIN
        </button>
      )}
      {isAdmin&&(
        <button onClick={onAdmin}
          style={{padding:compact?'14px 40px':'16px 56px',background:'linear-gradient(135deg,#8b6914,#6b4a10)',
            border:'3px solid #ffd700',borderRadius:'14px',color:'white',fontFamily:'Rajdhani',
            fontWeight:900,fontSize:compact?'18px':'22px',cursor:'pointer',letterSpacing:'2px',
            boxShadow:'0 6px 30px rgba(139,105,20,0.6)',touchAction:'manipulation'}}>
          ⚙️ BUKA ADMIN PANEL
        </button>
      )}
      <div style={{color:'rgba(255,255,255,0.2)',fontSize:compact?'10px':'11px',textAlign:'center',lineHeight:1.6}}>
        {compact?'Ketuk opsi kiri (🦁) atau kanan (🦅)':'Keyboard Tim A: 1/2/3/4 · Gunakan touchscreen untuk Tim B'}
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function App(){
  useStyles();
  const vp=useViewport();
  const[teachers,setTeachers]=useState(INIT_TEACHERS);
  const[teachersLoaded,setTeachersLoaded]=useState(false);
  const[screen,setScreen]=useState('login');// login | start | playing | admin
  const[currentTeacher,setCurrentTeacher]=useState(null);

  // Load dari storage
  useEffect(()=>{
    loadTeachers().then(data=>{
      if(data&&typeof data==='object'&&Object.keys(data).length>0){
        // Merge: pastikan soal default masih ada jika guru belum punya soal
        const merged={...INIT_TEACHERS,...data};
        Object.keys(merged).forEach(k=>{
          if(!merged[k].q||merged[k].q.length===0){
            merged[k].q=INIT_TEACHERS[k]?.q||[];
          }
        });
        setTeachers(merged);
      }
      setTeachersLoaded(true);
    }).catch(()=>setTeachersLoaded(true));
  },[]);

  // Simpan ke storage setiap kali berubah
  useEffect(()=>{
    if(!teachersLoaded)return;
    saveTeachers(teachers);
  },[teachers,teachersLoaded]);

  const handleLogin=(teacher)=>{
    setCurrentTeacher(teacher);
    setScreen(teacher.id==='admin'?'admin':'start');
  };
  const handleSaveTeachers=(updated)=>{
    setTeachers(updated);
    if(currentTeacher)setCurrentTeacher(updated[currentTeacher.id]||currentTeacher);
  };
  const handleLogout=()=>{setCurrentTeacher(null);setScreen('login');};
  const handleStart=()=>setScreen('playing');
  const handleBackToStart=()=>setScreen(currentTeacher?.id==='admin'?'admin':'start');

  if(!teachersLoaded){
    return(
      <div style={{width:'100vw',height:'100dvh',display:'flex',alignItems:'center',justifyContent:'center',
        background:'#1a0900',flexDirection:'column',gap:'16px',fontFamily:'Rajdhani,sans-serif'}}>
        <div style={{fontSize:'40px',animation:'pulseGold 1s infinite'}}>🏆</div>
        <div style={{color:'#ffd700',fontSize:'16px',fontWeight:700,letterSpacing:'2px'}}>Memuat...</div>
      </div>
    );
  }

  if(screen==='login')return<LoginScreen teachers={teachers} onLogin={handleLogin}/>;
  if(screen==='admin')return<AdminDashboard teachers={teachers} onSave={handleSaveTeachers} onBack={handleLogout}/>;
  if(screen==='playing'&&currentTeacher)return<PlayingScreen teacher={currentTeacher} onBack={handleBackToStart}/>;
  return(
    <StartScreen teacher={currentTeacher} onStart={handleStart}
      onAdmin={()=>setScreen('admin')} onLogout={handleLogout} isMobile={vp.isMobile}/>
  );
}
