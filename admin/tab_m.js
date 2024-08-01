"use strict";

// var socket = io.connect('/', {path: '/socket.io'})   // not needed, via adapter-settings

AddCams()

function asyncEmit(command, data1 = "", data2 = "") {
    return new Promise(function (resolve, reject) {
        if (data2 !== "")
            socket.emit(command, data1, data2, function (err, result) {
                if (!err && result)
                    resolve(result);
                else
                    reject(err);
            });
        else
            socket.emit(command, data1, function (err, result) {
                if (!err && result)
                    resolve(result);
                else
                    reject(err);
            });
    });
}

async function AddCams() {
    /*
    const devs = await asyncEmit("getForeignObjects", "ring." + instance + ".cocoa_*", "device")
        .then((result) => { return result; })
        .catch((error) => { console.log(error); return; });
    const devs = await asyncEmit("getForeignObjects", "ring." + instance + ".stickup_*", "device")
        .then((result) => { return result; })
        .catch((error) => { console.log(error); return; });
    */
    const devs = await asyncEmit("getForeignObjects", "ring." + instance + ".*", "device")
        .then((result) => { return result; })
        .catch((error) => { console.log(error); return; });
    let cam = 0;
    // for (const c = 0; c < 3; c++) // Test more than one camera
    for (const dev_prop in devs) {
        const dev = dev_prop.split(".").pop() // device name
        if (dev.startsWith("cocoa") || dev.startsWith("stickup")) {
            const camera = devs[dev_prop].common.name.split('("').pop().slice(0, -2);
            const elem = document.getElementById("camera " + cam);
            cam++
            const elemdiv = document.createElement("div")
            elemdiv.id = "camera " + cam
            elemdiv.className = "row"
            elemdiv.style = "padding: 2px"
            const elemdivstr = document.createElement("string")
            elemdivstr.className = "col s12 title center"
            elemdivstr.style = "padding: 5px; background-color:#174475; font-size: 1.9rem; border-radius: 4px"
            elemdivstr.innerText = camera // + c
            elemdiv.appendChild(elemdivstr)
            elem.append(elemdiv)
            const files = await asyncEmit("readDir", "ring." + instance, dev)
                .then((result) => { return result; })
                .catch((error) => { console.log(error); return; });
            const sn= files.filter(e=>!e.file.includes("HDsnapshot") &&  e.file.slice(-3) === "jpg").map(a=>a.file)
            const hd= files.filter(e=> e.file.includes("HDsnapshot") &&  e.file.slice(-3) === "jpg").map(a=>a.file)
            const mv= files.filter(e=>e.file.slice(-3) === "mp4").map(a=>a.file)    

            const media = await asyncEmit("getStates", devs[dev_prop]._id + ".*.url")
                .then((result) => { return result; })
                .catch((error) => { console.log(error); return; });

            for (const media_prop in media) {
                const title = media[media_prop].val.split("_").pop().split(".")[0];
                const type = media[media_prop].val.split("_").pop().split(".")[1];
                const med = document.createElement("div")
                med.className = "col s12 m12 l4"
                const medh5 = document.createElement("h5")
                medh5.className = "translate center blue-text text-darken-2"
                medh5.innerText = title // + c
                med.appendChild(medh5)
                let medm
                let medmsrc
                if (type === "jpg") {
                    medm = document.createElement("img")
                    medm.src = media[media_prop].val
                    medm.style = "max-width: 100%"
                    medm.alt = title
                    medm.addEventListener("click", ()=>{ medm.requestFullscreen() }) // works not on ios :-()
                } else { // mp4
                    medm = document.createElement("video")
                    medm.playsInline = true
                    medm.preload = "auto"
                    medm.autoplay = false
                    medm.controls = true
                    medm.style = "max-width: 100%"
                    medm.alt = title
                    medmsrc = document.createElement("source")
                    medmsrc.src =  media[media_prop].val
                    medmsrc.type = 'video/mp4'
                    medm.appendChild(medmsrc)
                    medm.load()
                }
                med.appendChild(medm)
                let ml
                if (type === "jpg") {
                    if (title === "Snapshot")
                        ml = sn
                    else
                        ml = hd
                } else
                    ml = mv
                if (ml.length > 0) {
                    // check if ts is included in first filename
                    try {
                        const test = new Date(Number(ml[0].split("_").pop(0).split(".")[0])).toLocaleString()
                    } catch (e) {
                        console.log("Filename has no timestamp")
                        elemdiv.appendChild(med)
                        continue
                    }
                    const inp = document.createElement("div")
                    inp.className = 'input-field col s12 m12 l12'

                    const sel = document.createElement("select")
                    sel.id = "#inp" + title
                    sel.className = 'value'
                    
                    sel.options.add(new Option(translateWord("ChooseDate"), ""))
                    for (const e of ml)
                        sel.options.add(new Option(new Date(Number(e.split("_").pop(0).split(".")[0])).toLocaleString(), e))

                    sel.addEventListener("change", (event)=>{
                        let source = ""
                        if (event.target.value === "") // back to default
                            source = media[media_prop].val
                        else
                            source = location.protocol + '//' + location.hostname + ':8082/ring.' + instance + '/' + dev + '/' + event.target.value
                        if (type === "jpg") {
                            medm.src = source
                        } else {
                            medmsrc.src = source
                            medm.load()
                        } 
                    })
                    inp.appendChild(sel)
                    med.appendChild(inp)
                }
                elemdiv.appendChild(med)
            }
        }
    }
    // re-init materialize Events
    var elems = document.querySelectorAll('select')
    var instances = M.FormSelect.init(elems)
    translateAll()
}

// http://dev-ring-ioBrocker-Dev:8082/ring.0/ring_0_cocoa_308343825_HDSnapshot.jpg
// /opt/iobroker/iobroker-data/files/ring.0/cocoa_308343825/HDsnapshot308343825_1696092057994.jpg