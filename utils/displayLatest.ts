const displayLatest = (message: string) => {
  return message.length < 36 ? message : `${message.slice(0, 35)}...`;
};

export default displayLatest;
