window.onload = main;

function main() {
    // Register listeners for drag&drop
    const dropArea = document.getElementsByTagName("body")[0];
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropArea.addEventListener(eventName, PreventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach((eventName) => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('highlight');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach((eventName) => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('highlight');
        }, false);
    });

    dropArea.addEventListener('drop', DropHandler, false);
}

function PreventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

function DropHandler(e) {
    UploadHandler(e.dataTransfer.files);
}

class DllFile {
    constructor(data) {
        this.content = data;
        this.valid;
        this.bit64;
        this.peLocation;
    }

    IsValidDll() {
        if (this.valid !== undefined) return [this.valid];

        this.valid = new DataView(this.content.slice(0, 2).buffer, 0).getUint16(0, true) === 0x5A4D;
        if (!this.valid) return [this.valid, "Invalid DOS Magic"];

        this.peLocation = new DataView(this.content.slice(0x3C, 0x40).buffer, 0).getUint32(0, true);

        this.valid = new DataView(this.content.slice(this.peLocation, this.peLocation + 4).buffer, 0).getUint32(0, true) === 0x4550;
        if (!this.valid) return [this.valid, "Invalid PE Magic"];

        this.valid = (new DataView(this.content.slice(this.peLocation + 0x16, this.peLocation + 0x18).buffer, 0).getUint16(0, true) & 8194) === 8194;
        if (!this.valid) return [this.valid, "File not a DLL"];

        return [true];
    }

    Is64bit() {
        if (this.bit64 !== undefined) return this.bit64;

        this.bit64 = new DataView(this.content.slice(this.peLocation + 4, this.peLocation + 6).buffer, 0).getUint16(0, true) === 0x8664;
        return this.bit64;
    }

    FindPattern(pattern) {
        const patternLength = pattern.length;

        let iMatched = 0;
        let lastFound = -1;

        for (const [idx, val] of this.content.entries()) {
            const toMatch = pattern[iMatched];

            if (toMatch === "?") {
                iMatched++;
            } else {
                if (parseInt(toMatch, 16) === val) {
                    iMatched++;
                } else {
                    iMatched = 0;
                    lastFound = -1;
                }
            }

            if (iMatched === 1 && lastFound === -1) {
                lastFound = idx;
            } else if (iMatched === patternLength) {
                break;
            }
        }

        return [iMatched === patternLength, lastFound];
    }
}

function SetStatus(text) {
    document.getElementsByTagName("p")[0].innerText = text;
}

const downloadURL = (data, fileName) => {
    const a = document.createElement('a')
    a.href = data
    a.download = fileName
    document.body.appendChild(a)
    a.style.display = 'none'
    a.click()
    a.remove()
  }
  
  const downloadBlob = (data, fileName, mimeType) => {
    const blob = new Blob([data], {
      type: mimeType
    })
    const url = window.URL.createObjectURL(blob)
    downloadURL(url, fileName)
    setTimeout(() => window.URL.revokeObjectURL(url), 1000)
  }

function UploadHandler(files) {
    const file = files[0];
    
    if (file.name !== "lua_shared.dll")
        return SetStatus(`Error: Expected name 'lua_shared.dll', got: '${file.name}'`);
    
    if (file.type !== "application/x-msdownload")
        return SetStatus(`Error: Expected type 'application/x-msdownload', got: '${file.type}'`);
    
    const reader = new FileReader();

    reader.addEventListener('load', e => {
        const t0 = performance.now();
        let fileContent = new Uint8Array(e.target.result);
        let Dll = new DllFile(fileContent);

        const [isValid, reason] = Dll.IsValidDll();
        if (!isValid) return SetStatus(`Error: ${reason}`);

        if (Dll.Is64bit()) {
            const signature = ["48","8B","4B","08","4C","8D","05","?","?","?","?","BA","EE","D8","FF","FF","E8","?","?","?","?","48","8B","4B","08","E8","?","?","?","?","48","8B","4B","08","4C","8D","05","?","?","?","?","BA","FE","FF","FF","FF","E8","?","?","?","?","48","8B","4B","08","E8","?","?","?","?"];
            const [found, location] = Dll.FindPattern(signature);
            if (!found) return SetStatus("Error: Pattern not found");

            fileContent[location] = 0xE9;
            fileContent[location + 1] = 0x96;
            fileContent[location + 2] = 0;
            fileContent[location + 3] = 0;
            fileContent[location + 4] = 0;

            downloadBlob(fileContent, "lua_shared.dll.unlocked", "application/x-msdownload");

            // TODO: Document area around signature (maybe use cheat engine).
        } else {
            // TODO: Document area around signature (maybe use cheat engine).
            const signature = ["68","?","?","?","?","68","EE","D8","FF","FF","FF","76","04","E8","?","?","?","?","FF","76","04","E8","?","?","?","?","68","?","?","?","?","6A","FE","FF","76","04","E8","?","?","?","?","FF","76","04","E8","?","?","?","?"];
            const [found, location] = Dll.FindPattern(signature);
            if (!found) return SetStatus("Error: Pattern not found");

            fileContent[location] = 0xEB;
            fileContent[location + 1] = 0x79;
            
            downloadBlob(fileContent, "lua_shared.dll.unlocked", "application/x-msdownload");
        }

        SetStatus(`Unlocked in ${(performance.now() - t0).toPrecision(4)}ms`);
    });
    // TODO: Monitor progress and display mini %
    // TODO: Add FindPattern for code section only
    reader.readAsArrayBuffer(file);
}