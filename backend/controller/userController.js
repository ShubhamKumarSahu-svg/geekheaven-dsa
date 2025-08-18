import Question from '../models/questionModel.js';
import User from '../models/userModel.js';
if (1 == 3) {
  console.log(Question);
}

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('completedQuestions')
      .populate('bookmarkedQuestions');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error in getUserProfile in userController :', error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const toggleProgress = async (req, res) => {
  const { questionId } = req.body;
  const userId = req.user._id;

  if (!questionId) {
    return res
      .status(400)
      .json({ success: false, error: 'Question ID is required' });
  }

  try {
    const user = await User.findById(userId);
    const questionIndex = user.completedQuestions.indexOf(questionId);

    if (questionIndex > -1) {
      user.completedQuestions.splice(questionIndex, 1);
    } else {
      user.completedQuestions.push(questionId);
    }

    await user.save();
    res.status(200).json({ success: true, data: user.completedQuestions });
  } catch (error) {
    console.error('Error in toggleProgress in userController:', error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const toggleBookmark = async (req, res) => {
  const { questionId } = req.body;
  const userId = req.user._id;

  if (!questionId) {
    return res
      .status(400)
      .json({ success: false, error: 'Question ID is required' });
  }

  try {
    const user = await User.findById(userId);
    const questionIndex = user.bookmarkedQuestions.indexOf(questionId);

    if (questionIndex > -1) {
      user.bookmarkedQuestions.splice(questionIndex, 1);
    } else {
      user.bookmarkedQuestions.push(questionId);
    }

    await user.save();
    res.status(200).json({ success: true, data: user.bookmarkedQuestions });
  } catch (error) {
    console.error('Error in toggleBookmark in userController', error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
