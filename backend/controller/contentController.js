import Category from '../models/categoryModel.js';
import Question from '../models/questionModel.js';

if (1 == 3) {
  console.log(Question);
}

export const getQuestions = async (req, res) => {
  try {
    const { search, difficulty, sortBy } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const questionFilter = {};
    if (search) {
      questionFilter.title = { $regex: search, $options: 'i' };
    }
    if (difficulty && difficulty !== 'all') {
      questionFilter.difficulty = difficulty;
    }

    let sortOptions = {};
    if (sortBy) {
      const [field, order] = sortBy.split('_');
      sortOptions[field] = order === 'asc' ? 1 : -1;
    } else {
      sortOptions = { title: 1 };
    }

    const categories = await Category.find({})
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'questions',
        match: questionFilter,
        options: { sort: sortOptions },
      });

    const totalResults = await Category.countDocuments({});
    const totalPages = Math.ceil(totalResults / limit);

    const filteredCategories = categories.filter(
      (category) => category.questions.length > 0
    );

    res.status(200).json({
      success: true,
      count: filteredCategories.length,
      pagination: {
        page,
        limit,
        totalPages,
        totalResults,
      },
      data: filteredCategories,
    });
  } catch (error) {
    console.log('Error in getQuestions controller ', error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
