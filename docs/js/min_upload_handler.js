function main(){const t=document.getElementsByTagName("body")[0];["dragenter","dragover","dragleave","drop"].forEach(e=>{t.addEventListener(e,PreventDefaults,!1)}),["dragenter","dragover"].forEach(e=>{t.addEventListener(e,()=>{t.classList.add("highlight")},!1)}),["dragleave","drop"].forEach(e=>{t.addEventListener(e,()=>{t.classList.remove("highlight")},!1)}),t.addEventListener("drop",DropHandler,!1)}function PreventDefaults(t){t.preventDefault(),t.stopPropagation()}function DropHandler(t){UploadHandler(t.dataTransfer.files)}window.onload=main;class DllFile{constructor(t){this.content=t,this.valid,this.bit64,this.peLocation}IsValidDll(){return void 0!==this.valid?[this.valid]:(this.valid=23117===new DataView(this.content.slice(0,2).buffer,0).getUint16(0,!0),this.valid?(this.peLocation=new DataView(this.content.slice(60,64).buffer,0).getUint32(0,!0),this.valid=17744===new DataView(this.content.slice(this.peLocation,this.peLocation+4).buffer,0).getUint32(0,!0),this.valid?(this.valid=8194==(8194&new DataView(this.content.slice(this.peLocation+22,this.peLocation+24).buffer,0).getUint16(0,!0)),this.valid?[!0]:[this.valid,"File not a DLL"]):[this.valid,"Invalid PE Magic"]):[this.valid,"Invalid DOS Magic"])}Is64bit(){return void 0!==this.bit64?this.bit64:(this.bit64=34404===new DataView(this.content.slice(this.peLocation+4,this.peLocation+6).buffer,0).getUint16(0,!0),this.bit64)}FindPattern(t){const e=t.length;let n=0,i=-1;for(const[a,o]of this.content.entries()){const r=t[n];if("?"===r?n++:parseInt(r,16)===o?n++:(n=0,i=-1),1===n&&-1===i)i=a;else if(n===e)break}return[n===e,i]}}function SetStatus(t){document.getElementsByTagName("p")[0].innerText=t}const downloadURL=(t,e)=>{const n=document.createElement("a");n.href=t,n.download=e,document.body.appendChild(n),n.style.display="none",n.click(),n.remove()},downloadBlob=(t,e,n)=>{const i=new Blob([t],{type:n}),a=window.URL.createObjectURL(i);downloadURL(a,e),setTimeout(()=>window.URL.revokeObjectURL(a),1e3)};function UploadHandler(t){const e=t[0];if("lua_shared.dll"!==e.name)return SetStatus(`Error: Expected name 'lua_shared.dll', got: '${e.name}'`);if("application/x-msdownload"!==e.type)return SetStatus(`Error: Expected type 'application/x-msdownload', got: '${e.type}'`);const n=new FileReader;n.addEventListener("load",t=>{const e=performance.now();let n=new Uint8Array(t.target.result),i=new DllFile(n);const[a,o]=i.IsValidDll();if(!a)return SetStatus(`Error: ${o}`);if(i.Is64bit()){const t=["48","8B","4B","08","4C","8D","05","?","?","?","?","BA","EE","D8","FF","FF","E8","?","?","?","?","48","8B","4B","08","E8","?","?","?","?","48","8B","4B","08","4C","8D","05","?","?","?","?","BA","FE","FF","FF","FF","E8","?","?","?","?","48","8B","4B","08","E8","?","?","?","?"],[e,a]=i.FindPattern(t);if(!e)return SetStatus("Error: Pattern not found");n[a]=233,n[a+1]=150,n[a+2]=0,n[a+3]=0,n[a+4]=0,downloadBlob(n,"lua_shared.dll.unlocked","application/x-msdownload")}else{const t=["68","?","?","?","?","68","EE","D8","FF","FF","FF","76","04","E8","?","?","?","?","FF","76","04","E8","?","?","?","?","68","?","?","?","?","6A","FE","FF","76","04","E8","?","?","?","?","FF","76","04","E8","?","?","?","?"],[e,a]=i.FindPattern(t);if(!e)return SetStatus("Error: Pattern not found");n[a]=235,n[a+1]=121,downloadBlob(n,"lua_shared.dll.unlocked","application/x-msdownload")}SetStatus(`Unlocked in ${(performance.now()-e).toPrecision(4)}ms`)}),n.readAsArrayBuffer(e)}