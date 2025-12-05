import { Server } from "socket.io";

const io = new Server(3001,
{
    cors: { origin: "*" }
});

const clients = new Map();

io.on("connection", (socket) =>
{
    console.log("Connexion :", socket.id);

    socket.on("presenting", (data) =>
    {
        console.log("Client présenté :", data.id, "(socket=", socket.id, ")");

        clients.set(data.id, {...data, socket});
        
        console.log("Clients enregistrés :", [...clients.keys()]);
    });

    socket.on("new_breakdown", (data) =>
    {
        const target = clients.get(data.tech);
        console.log("Recherche du client", data.tech, [...clients.keys()]);

        if (target)
        {
            console.log("Envoi de la panne au client", data.tech);
            target.socket.emit("new_breakdown", data);
        }
        else
        {
            console.log("Client NON trouvé");
        }
    });

    socket.on("disconnect", () =>
    {
        for (const [id, info] of clients.entries())
        {
            if (info.socket.id === socket.id)
            {
                clients.delete(id);
                console.log("Client supprimé", id);
                break;
            }
        }
    });
});
