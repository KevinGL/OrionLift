import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001 });

const clients = new Map();

wss.on("connection", (ws) =>
{
    console.log("Client connecté");

    ws.on("message", (data) =>
    {
        const parsed = JSON.parse(data);
        
        //console.log("Message reçu :", JSON.parse(data));
        console.log(parsed);

        if(parsed.event === "presenting")
        {
            clients.set(parsed.id, {id: parsed.id, role: parsed.role, ws});
            console.log("Présentation de : " + parsed.id);
        }

        else
        if(parsed.event === "new_breakdown")
        {
            const client = clients.get(parsed.tech);
            
            if(!client)
            {
                console.error(`Client ${parsed.tech} introuvable`);
            }

            else
            {
                client.ws.send(JSON.stringify({event: "new_breakdown", desc: parsed.desc, device: parsed.device, type: parsed.type}));
                console.log("Panne envoyée");
            }
        }
    });

    //ws.send("Bienvenue !");
});
