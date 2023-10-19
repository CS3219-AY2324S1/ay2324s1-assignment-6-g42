const { get_question_list, parser } = require('./helper_functions');
const pLimit = require('p-limit');

exports.fetchAllQuestions = async (req, res) => {
  const question_list = await get_question_list();
  const reversed_question_list = question_list.reverse();
  const length = question_list.length;
  /*
  const limit = pLimit(5); // Limit to 5 concurrent requests
  const tasks = reversed_question_list.map((question, index) => {
    return limit(() => {
        parser(question).then(() => {
        console.log(`Fetched ${index + 1}/${length} questions`);
      });
    });
  });
  await tasks;
  */
  for (let i = 0; i < length; i++) {
    await parser(reversed_question_list[i]);
    console.log(`Fetched ${i + 1}/${length} questions`);
  }
}