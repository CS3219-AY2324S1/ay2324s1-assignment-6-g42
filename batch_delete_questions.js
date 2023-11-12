require("./mongo-db");
const QuestionModel = require('./question');

async function deleteDocuments() {
    try {
        // Use deleteMany to remove documents with "id" greater than 4
        console.log('Deleting documents...');
        const deleteResult = await QuestionModel.deleteMany({ id: { $gt: 2 } });

        console.log(`Deleted ${deleteResult.deletedCount} documents.`);
    } catch (error) {
        console.error('Error deleting documents:', error);
    }
}
deleteDocuments()