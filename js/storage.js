window.TreeStorage = (() => {
  const key = "treeLectureFinalProgress";

  function read() {
    try {
      return JSON.parse(localStorage.getItem(key)) || { opened: [], score: 0, answered: {} };
    } catch (_) {
      return { opened: [], score: 0, answered: {} };
    }
  }

  function write(data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function markChunk(id) {
    const data = read();
    if (!data.opened.includes(id)) data.opened.push(id);
    write(data);
    return data;
  }

  function setQuizResult(index, correct) {
    const data = read();
    data.answered[index] = correct;
    data.score = Object.values(data.answered).filter(Boolean).length;
    write(data);
    return data;
  }

  return { read, write, markChunk, setQuizResult };
})();
