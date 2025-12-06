console.log("ws.ts");

let globalWS = globalThis as unknown as
{
    websocket?: WebSocket;
};

export function getSocket()
{
    return globalWS.websocket || null;
}

export function connectSocket(userId: number, role: string)
{
    if (globalWS.websocket && globalWS.websocket.readyState === WebSocket.OPEN)
    {
        return globalWS.websocket;
    }

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);

    ws.onopen = () =>
    {
        ws.send(JSON.stringify({event: "presenting", id: userId, role}));
    };

    globalWS.websocket = ws;

    return ws;
}

/*export function createBreakdownSocket(br: any)
{
    console.log("createBreakdownSocket");

    if(!socket)
    {
        return;
    }

    socket.onopen = () =>
    {
        console.log("Send");
        
        socket?.send(JSON.stringify({
            event: "new_breakdown",
            tech: br.user.id,
            desc: br.description,
            type: br.type,
            ref: br.device.ref,
            location: `${br.device.address} ${br.device.zipCode} ${br.device.city}`
        }));
    };
}*/