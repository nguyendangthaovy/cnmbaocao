export const getAcronym = (name: string) => {
  if (name) {
    const acronym = name
      .split(/\s/)
      .reduce((response, word) => (response += word.slice(0, 1)), "")
      .toUpperCase();

    return acronym.slice(0, 2);
  }
  return "";
};

export const getConversationByUserId = (
  userId: string,
  conversations: Array<any>
) => {
  const conversation = conversations.find((e) => {
    return e.userId === userId && e.type === false;
  });

  return conversation;
};

export const getGroupConversationById = (
  conversationId: string,
  conversations: Array<any>
) => {
  const conversation = conversations.find((e) => {
    return e._id === conversationId && e.type === true;
  });

  console.log(conversation);

  return conversation;
};
