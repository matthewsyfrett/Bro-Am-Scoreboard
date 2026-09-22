
const express=require("express"),http=require("http"),path=require("path"),fs=require("fs");
const app=express(),srv=http.createServer(app),PORT=process.env.PORT||3000;
const DATA=path.join(__dirname,"data","trip.json");
let trip=JSON.parse(fs.readFileSync(DATA,"utf8"));
function save(){fs.mkdirSync(path.dirname(DATA),{recursive:true});fs.writeFileSync(DATA,JSON.stringify(trip,null,2));}
app.use(express.json({limit:"1mb"})); app.use(express.static(path.join(__dirname,"public")));
app.get("/api/trip",(req,res)=>res.json(trip));
app.post("/api/trip",(req,res)=>{trip=Object.assign({},trip,req.body,{revision:(trip.revision||0)+1});save();res.json(trip);});
app.post("/api/scores",(req,res)=>{
  const b=req.body||{};
  if(!b.game||!b.key||!Array.isArray(b.holes)) return res.status(400).json({error:"Invalid score payload"});
  trip.scores[b.game]=trip.scores[b.game]||{};
  trip.scores[b.game][b.key]=b.holes.map(v=>v===""||v==null?null:Number(v));
  trip.revision=(trip.revision||0)+1; save(); res.json(trip);
});
app.post("/api/reset-scores",(req,res)=>{trip.scores={bestball:{},individual1:{},scramble:{},individual3:{}};trip.revision=(trip.revision||0)+1;save();res.json(trip);});
app.get("/health",(req,res)=>res.json({ok:true}));
app.use((req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
srv.listen(PORT,()=>console.log("Bro-Am Live Golf on "+PORT));
