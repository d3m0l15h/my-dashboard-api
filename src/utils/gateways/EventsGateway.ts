import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000','ron.findurjob.uk'],
        methods: ['GET', 'POST'],
        credentials: true
    }
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() 
    server: Server;
    private logger: Logger = new Logger('EventsGateway');


    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    notifyGuildDelete(guildId: string) {
        this.server.emit('guildDelete', {guildId});
    }
}