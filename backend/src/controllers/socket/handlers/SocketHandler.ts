


abstract  class SocketHandler {
    protected socket :any | null
    protected io :any | null;
    protected onlineUsers: any = null;
    constructor(socket:any,io:any, onlineUsers: any = null) {
        this.socket = socket;
        this.io = io;
        this.onlineUsers = onlineUsers;
    }
    abstract socketEvents(): void;
   public getReceiverId(userId: string): string | null {
        return this.onlineUsers[userId] 
      }
}
export { SocketHandler };