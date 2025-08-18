import connect_db from '../db/connect_db.js';
import Category from '../models/categoryModel.js';
import Question from '../models/questionModel.js';

import axios from 'axios';
import { config } from 'dotenv';
config();

const import_dev_data = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    console.log('Database connecting...');
    await connect_db();

    console.log('Data clearing...');
    await Category.deleteMany();
    await Question.deleteMany();
    console.log('Data cleared!');

    console.log('Fetching data...');
    const response = await axios.get(
      'https://test-data-gules.vercel.app/data.json'
    );
    console.log('Seeding data to db...');

    const categoriesData = response.data.data;
    console.log('data fetched...');
    const difficulties = ['Easy', 'Medium', 'Hard'];

    for (const categoryData of categoriesData) {
      const question = categoryData.ques.filter(
        (q) => q.title !== null && (q.p1_link || q.p2_link || q.yt_link)
      );
      if (question.length === 0) {
        continue;
      }

      const question_to_create = question.map((q) => {
        const urls = [];
        if (q.p1_link) urls.push(q.p1_link);
        if (q.p2_link) urls.push(q.p2_link);
        if (q.yt_link) urls.push(q.yt_link);

        return {
          title: q.title,
          url: urls,
          difficulty: difficulties[Math.floor(Math.random() * 3)],
        };
      });

      const created_questions = await Question.insertMany(question_to_create);

      const question_ids = created_questions.map((q) => q._id);
      const category = new Category({
        title: categoryData.title,
        questions: question_ids,
      });

      await category.save();
    }

    console.log('All data is imported!');
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
};

import_dev_data();
