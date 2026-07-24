const connectButton = document.getElementById("connect");

const xText = document.getElementById("x");
const yText = document.getElementById("y");
const buttonState = document.getElementById("buttonState");

const dot = document.getElementById("dot");

connectButton.addEventListener("click", async () => {

    try {

        const port = await navigator.serial.requestPort();

        await port.open({

            baudRate:9600

        });

        const decoder = new TextDecoderStream();

        port.readable.pipeTo(decoder.writable);

        const reader = decoder.readable.getReader();

        while(true){

            const {value,done}=await reader.read();

            if(done){

                break;

            }

            if(!value){

                continue;

            }

            const lines=value.split("\n");

            lines.forEach(line=>{

                const data=line.trim().split(",");

                if(data.length!==3){

                    return;

                }

                const x=parseInt(data[0]);

                const y=parseInt(data[1]);

                const sw=parseInt(data[2]);

                xText.textContent=x;

                yText.textContent=y;

                if(sw===0){

                    buttonState.textContent="Pressed";

                }

                else{

                    buttonState.textContent="Released";

                }

                const screenX=(x/1023)*470;

                const screenY=(y/1023)*470;

                dot.style.left=screenX+"px";

                dot.style.top=screenY+"px";

            });

        }

    }

    catch(error){

        console.error(error);

        alert("Connection Failed");

    }

});