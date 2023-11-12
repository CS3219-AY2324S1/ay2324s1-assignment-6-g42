const functions = require('@google-cloud/functions-framework');
const { fetchAllQuestions } = require('./fetch_leechcode_questions')

functions.http('fetch_leetcode_questions', async (req, res) => {
    await fetchAllQuestions();
    res.send("all questions fetching completed")
});