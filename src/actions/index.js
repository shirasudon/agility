import ChatActionCreator from './chat';

import * as chatApiStub from "../api/chatApiStub";//TODO: modify to real API when its done

export const chatActionCreator = new ChatActionCreator(chatApiStub);
