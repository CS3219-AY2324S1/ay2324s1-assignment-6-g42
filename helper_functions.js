const crypto = require('crypto');
const cheerio = require('cheerio');
const axios = require('axios');
const QuestionModel = require('./question');
require('./mongo-db')

function hash(content) {
    const hash = crypto.createHash('sha256');
    hash.update(content);
    return hash.digest('hex');
}

function removeHtmlTags(content) {
    const $ = cheerio.load(content);
    return $.text();
}

async function get_question_list() {
    const response = await axios.get('https://leetcode.com/api/problems/all');
    const raw_data = response.data;
    const stat_status_pairs = raw_data.stat_status_pairs;
    // Filter out questions with "isPaidOnly" set to true
    const free_questions = stat_status_pairs.filter((item) => !item.paid_only);
    const free_question_title_slug = free_questions.map((i) => i.stat.question__title_slug);
    return free_question_title_slug;
};

async function parser(question) {
    const query = `
        query questionData {
            question(titleSlug: "${question}") {
            questionId
            title
            titleSlug
            content
            isPaidOnly
            difficulty
            topicTags {
                name
                slug
            }
            stats
            }
        }
        `;
  
    
    try {
        const response = await axios.post("https://leetcode.com/graphql", {query});
        const data = response.data.data.question;
        //Skip if the question access require premium
        if (data.isPaidOnly) {
            console.log(`Skipping question "${data.title}" because it is paid-only.`);
            return;
          }
        data.url = `https://leetcode.com/problems/${data.titleSlug}`;
        data.title = "[Leetcode] " + data.title;
        const fetchedDescription = removeHtmlTags(data.content);
        //Query for an existing question in database with the same id and url
        const existingQuestion = await QuestionModel.findOne({ $or: [{ title: data.title }, { link: data.url }] });

        if (existingQuestion) {
            // Compare content
            if (hash(existingQuestion.description) !== hash(fetchedDescription)) {
                // Content has changed, update the existing question
                existingQuestion.title = data.title;
                existingQuestion.description = fetchedDescription;
                existingQuestion.categories = data.topicTags.map((tag) => tag.name);
                existingQuestion.complexity = data.difficulty;
                await existingQuestion.save();
                console.log(`Updated question "${data.title}"`);
            } else {
                // Content hasn't changed, skip the question
                console.log(`Skipped question "${data.title}" (no content change)`);
            }
        } else {
            // Question doesn't exist in the database, insert it
            // Find the maximum ID in the database
            const maxIdQuery = QuestionModel.findOne().sort({ id: -1 }).select('id');
            const maxIdDocument = await maxIdQuery.exec();

            // Calculate the next ID
            const maxId = maxIdDocument ? maxIdDocument.id : 0;
            const nextId = maxId + 1;
            const newQuestion = new QuestionModel({
                id: nextId,
                title: data.title,
                description: removeHtmlTags(data.content),
                categories: data.topicTags.map((tag) => tag.name),
                complexity: data.difficulty,
                link: data.url,
            });
            await newQuestion.save();
            console.log(`Inserted question "${data.title}" with ID ${nextId}`);
        }
    } catch (error) {
        console.error(`Error fetching ${question}: ${error.message}`);
    }
};

module.exports = { get_question_list, parser };