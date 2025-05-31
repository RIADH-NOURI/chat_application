import { PrivateChatMessage } from "@/types";


export const updateNewMessageCache = (oldData: any, newMessage: any) => {
    if (!oldData || !Array.isArray(oldData?.pages)) return oldData;
  
    const updatedPages = oldData.pages.map((page: any, index: number) => {
      if (index === 0) {
        return {
          ...page,
          messages: [newMessage, ...page.messages],
        };
      }
      return page;
    });
  
    return {
      ...oldData,
      pages: updatedPages,
    };
  };

  export const UpdateNewImagesCache = (
    oldData: any,
    newMessageId: string,
    uploadedImageUrls: string[],
    typeFile: "image" | "document"
  ) => {
    if (!oldData || !Array.isArray(oldData.pages)) return oldData;
  
    const updatedPages = oldData.pages.map((page: any) => {
      return {
        ...page,
        messages: page.messages.map((message: any) => {
          if (message._id === newMessageId) {
            return {
              ...message,
              ...(typeFile === "image"
                ? { images: uploadedImageUrls }
                : { files: uploadedImageUrls }),
            };
          }
          return message;
        }),
      };
    });
  
    return { ...oldData, pages: updatedPages };
  };
  
  
  export const updateReactionsCache = (
    oldData: any,
    messageId: string,
    userId: string,
    emoji: string
  ) => {
    if (!oldData || !Array.isArray(oldData.pages)) return oldData;
  
    const updatedPages = oldData.pages.map((page: any) => {
      const updatedMessages = page?.messages.map((msg: any) => {
        if (msg?._id !== messageId) return msg;
  
        const existingReactions = msg.reactions || [];
  
        const alreadyReactedWithSameEmoji = existingReactions.some(
          (r: any) => r.userId === userId && r.emoji === emoji
        );
  
        let newReactions;
  
        if (alreadyReactedWithSameEmoji) {
          // Remove the same reaction (toggle off)
          newReactions = existingReactions.filter(
            (r: any) => !(r.userId === userId && r.emoji === emoji)
          );
        } else {
          // Remove previous emoji from same user (if any), then add new one
          newReactions = [
            ...existingReactions.filter((r: any) => r.userId !== userId),
            { userId, emoji },
          ];
        }
  
        return {
          ...msg,
          reactions: newReactions,
        };
      });
  
      return { ...page, messages: updatedMessages };
    });
  
    return { ...oldData, pages: updatedPages };
  };
  

  export const updateReactionSubscribeSocketCache = ( oldData: any, updateReaction: any )=>{
    if (!oldData || !Array.isArray(oldData.pages)) return oldData;

    const updatedPages = oldData.pages.map((page: any) => ({
      ...page,
      messages: page.messages.map((msg: PrivateChatMessage) =>
        msg._id === updateReaction.messageId
          ? { ...msg, reactions: updateReaction.reactions }
          : msg
      ),
    }));

    return { ...oldData, pages: updatedPages };
  }

  

  export const updateUsersReadCache =( oldData: any, userId: string )=>{
    if (!oldData || !Array.isArray(oldData.pages)) return oldData;
  
    const lastPageIndex = oldData.pages.length - 1;
    const lastPage = oldData.pages[lastPageIndex];

    if (!lastPage || !Array.isArray(lastPage.messages)) return oldData;

    const messages = [...lastPage.messages];
    const lastMsgIndex = messages.length - 1;

    if (lastMsgIndex < 0) return oldData;

    const lastMessage = messages[lastMsgIndex];

    if (lastMessage?.receiverId?._id === userId && !lastMessage.usersRead.includes(userId)) {
      messages[lastMsgIndex] = {
        ...lastMessage,
        usersRead: [...lastMessage.usersRead, userId],
      };

      const updatedPages = [...oldData.pages];
      updatedPages[lastPageIndex] = {
        ...lastPage,
        messages,
      };

      return { ...oldData, pages: updatedPages };
    }

    return oldData;
  }
export const updateUsersReadSubscribeSocketCache = ( oldData: any, updateUsersRead: any )=>{
    if (!oldData || !Array.isArray(oldData.pages)) return oldData;

    const updatedPages = oldData.pages.map((page: any) => ({
      ...page,
      messages: page.messages.map((msg: PrivateChatMessage) =>
        msg._id === updateUsersRead.messageId
          ? { ...msg, usersRead: updateUsersRead.usersRead}
          : msg
      ),
    }));

    return { ...oldData, pages: updatedPages };
  }

  export const updateDeleteMessageCache = ( oldData: any, messageId: string )=>{
    if (!oldData || !Array.isArray(oldData.pages)) return oldData;

    const updatedPages = oldData.pages.map((page: any) => ({
      ...page,
      messages: page.messages.filter((msg: any) => msg._id !== messageId),
    }));

    return { ...oldData, pages: updatedPages };
  }