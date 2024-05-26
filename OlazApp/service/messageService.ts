import { ParamsApi } from "../components/ChatRoomItem/ChatRoomItem";
import { httpRequest } from "./../utils/httpRequest";

export const apiMessage = {
  getMessages: async (conversationId: string, paramsApi: ParamsApi) => {
    const { page, size } = paramsApi;
    return await httpRequest.get(`/messages/${conversationId}`, {
      params: {
        page,
        size,
      },
    });
  },

  sendText: async ({
    conversationId,
    content,
    type = "TEXT",
  }: {
    conversationId: string;
    content: string;
    type: string;
  }) => {
    return await httpRequest.post(`/messages/text`, {
      conversationId,
      content,
      type,
    });
  },

  sendFile: async ({
    formData,
    attachInfo,
    callback,
  }: {
    formData: any;
    attachInfo: any;
    callback: any;
  }) => {
    const { type, conversationId } = attachInfo;
    const config = {
      params: {
        type,
        conversationId,
      },
      onUploadProgress: function (progressEvent: any) {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        callback(percentCompleted);
      },
    };

    return await httpRequest.post(`/messages/files`, formData, config);
  },

  sendFiles: async ({
    formData,
    attachInfo,
    callback,
  }: {
    formData: any;
    attachInfo: any;
    callback: any;
  }) => {
    const { type, conversationId } = attachInfo;
    const config = {
      params: {
        type,
        conversationId,
      },
      onUploadProgress: function (progressEvent: any) {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        callback(percentCompleted);
      },
    };
    return await httpRequest.post(`/messages/multiple/files`, formData, config);
  },
};

// export const messages = async (conversationId : string) => {
//     try {
//         const res = await httpRequest.get(`messages/${conversationId}`)
//         // console.log("data : ", res.data)
//         return res.data;
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const addText = async (conversationId: string, content : string, type: "TEXT" | 'HTML'| 'NOTIFY'| 'STICKER'= "TEXT" ) => {
//     try {
//         const res = await httpRequest.post("messages/text", {conversationId, content, type}, {withCredentials : true})
//     } catch (error) {
//         console.log(error);

//     }
// }
