import{a as S,K as q,L as E,M as O,O as T,r as j,j as e}from"./index-Cqs9DpvL.js";import{u as I,a as D,E as n,C as F}from"./EditQuestionFormInput-CGDPuIhq.js";const M=()=>{const p=S(),{id:c}=q(),{data:l,error:f,isLoading:v}=E(c),[w,{isLoading:g}]=O(),[y]=T(),{control:a,handleSubmit:N,reset:x}=I({defaultValues:l==null?void 0:l.responseObject}),{fields:d,append:o,remove:u}=D({control:a,name:"locales"}),[i,b]=j.useState(""),C=async()=>{if(!i)return alert("Select a language!");try{const s=await y({questionId:c,language:i}).unwrap();console.log("Translation response:",s),o({language:i,question:s.responseObject.question,correct:s.responseObject.correct,wrong:s.responseObject.wrong,isValid:!1}),b("")}catch(s){console.error("Translation failed:",s)}},k=s=>{const t=d[s];o({...t,wrong:[...t.wrong,""]}),u(s)},A=(s,t)=>{const m=d[s],r=m.wrong.filter((h,Q)=>Q!==t);o({...m,wrong:r}),u(s)};j.useEffect(()=>{l&&x(l.responseObject)},[l,x]);const L=async s=>{try{await w(s).unwrap(),p("/questions-history")}catch(t){console.error("Failed to update question:",t)}};return v?e.jsx("p",{children:"Loading..."}):f?e.jsx("p",{children:"Error fetching question"}):l?e.jsxs("div",{className:"max-w-5xl mx-auto bg-white shadow-md rounded-md p-6",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsxs("h2",{className:"text-2xl font-semibold mb-4",children:["Edit Question: ",c]}),e.jsxs("button",{onClick:()=>p("/questions-history"),className:"flex items-center space-x-2 text-blue-500",children:[e.jsx("img",{src:"/back-arrow-svgrepo-com.svg",alt:"Back",className:"h-5 w-5"}),e.jsx("span",{children:"Back to History"})]})]}),e.jsxs("form",{onSubmit:N(L),className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(n,{label:"Category",name:"categoryId",control:a}),e.jsx(n,{label:"Status",name:"status",control:a,options:[{value:"pending",label:"Pending"},{value:"approved",label:"Approved"},{value:"rejected",label:"Rejected"}]}),e.jsx(n,{label:"Difficulty",name:"difficulty",control:a,type:"number"}),e.jsx(n,{label:"Type",name:"type",control:a,options:[{value:"choice",label:"One Choice"},{value:"map",label:"Map"}]}),e.jsx(n,{label:"Audio ID",name:"audioId",control:a}),e.jsx(n,{label:"Image ID",name:"imageId",control:a}),e.jsx(n,{label:"Author ID",name:"authorId",control:a}),e.jsx(n,{label:"Tags",name:"tags",control:a,placeholder:"Comma separated"}),e.jsx(n,{label:"Required Languages",name:"requiredLanguages",control:a,placeholder:"Comma separated"}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium",children:"Translate to"}),e.jsxs("div",{className:"flex space-x-4 justify-between items-center",children:[e.jsx("img",{src:"/deepl-svgrepo-com.svg",alt:"DeepL",className:"h-8 w-8"}),e.jsxs("select",{value:i,onChange:s=>b(s.target.value),className:"p-2 border rounded-md",children:[e.jsx("option",{value:"",children:"Select Language"}),e.jsx("option",{value:"de",children:"German"}),e.jsx("option",{value:"fr",children:"French"}),e.jsx("option",{value:"es",children:"Spanish"}),e.jsx("option",{value:"uk",children:"Ukrainian"})]}),e.jsx("button",{type:"button",className:"p-2 bg-blue-500 text-white rounded-md",onClick:C,children:"Translate"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Locales"}),e.jsx("div",{className:"grid grid-cols-2 gap-4",children:d.map((s,t)=>e.jsxs("div",{className:"p-4 border rounded-md",children:[e.jsxs("div",{className:"flex justify-between items-center mb-2",children:[e.jsx("h4",{className:"font-semibold",children:s.language.toUpperCase()}),e.jsx("button",{type:"button",className:"text-red-500 text-sm",onClick:()=>u(t),children:"Remove"})]}),e.jsx(n,{label:"Question",name:`locales.${t}.question`,control:a}),e.jsx(n,{label:"Correct Answer",name:`locales.${t}.correct`,control:a}),e.jsxs("div",{className:"flex justify-between items-center mt-2",children:[e.jsx("label",{className:"block text-sm font-medium",children:"Wrong Answers"}),e.jsx("button",{type:"button",className:"text-blue-500 text-sm",onClick:()=>{k(t)},children:"+ Add Wrong Answer"})]}),s.wrong.map((m,r)=>e.jsxs("div",{className:"flex items-center mt-2",children:[e.jsx(F,{name:`locales.${t}.wrong.${r}`,control:a,render:({field:h})=>e.jsx("input",{...h,type:"text",className:"w-full p-2 border rounded-md mt-1"})},r),e.jsx("button",{type:"button",className:"text-red-500",onClick:()=>{A(t,r)},children:e.jsx("img",{src:"/trash-xmark-alt-svgrepo-com.svg",alt:"Delete",className:"h-8 w-8"})})]},r))]},s.id))}),e.jsx("button",{type:"button",className:"mt-4 p-2 bg-green-500 text-white rounded-md",onClick:()=>o({language:"new",question:"",correct:"",wrong:[],isValid:!1}),children:"+ Add Locale"})]}),e.jsx("button",{type:"submit",className:"w-full bg-blue-500 text-white p-2 rounded-md mt-4",disabled:g,children:g?"Saving...":"Save Changes"})]})]}):e.jsx("p",{children:"Question not found"})};export{M as default};
