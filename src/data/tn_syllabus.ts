export interface UnitSyllabus {
  title: string;
  topics: string[];
  description: string;
}

export interface TermSyllabus {
  term: 'Term 1' | 'Term 2' | 'Term 3';
  units: UnitSyllabus[];
}

export const TN_CLASS_1_MATH: TermSyllabus[] = [
  {
    term: 'Term 1',
    units: [
      { title: 'Geometry', topics: ['Comparisons', 'Shapes'], description: 'Learn spatial vocabulary like top-bottom, inside-outside, and identify basic shapes.' },
      { title: 'Numbers', topics: ['Numbers from 1 to 9', 'Addition', 'Subtraction', 'Zero'], description: 'Explore the foundations of counting and basic arithmetic operations.' },
      { title: 'Patterns', topics: ['Patterns in sounds', 'Patterns in colour'], description: 'Discover how patterns are everywhere in nature and sounds.' },
      { title: 'Information Processing', topics: ['Systematic Listing', 'Organising Information'], description: 'Start learning how to group and list objects systematically.' }
    ]
  },
  {
    term: 'Term 2',
    units: [
      { title: 'Geometry', topics: ['Introduction to basic shapes', 'Introduction to straight lines'], description: 'Deepen your knowledge of squares, rectangles, circles, and lines.' },
      { title: 'Numbers', topics: ['Introduction to number 10', 'Numbers from 10 to 20', 'Addition'], description: 'Moving beyond single digits into the tens family.' },
      { title: 'Patterns', topics: ['Patterns in shapes', 'Patterns in body movements', 'Patterns in numbers'], description: 'Rhythmic patterns using body and movement.' },
      { title: 'Measurements', topics: ['Comparisons', 'Measures'], description: 'Learn to measure using hand spans, paces, and compare lengths.' }
    ]
  },
  {
    term: 'Term 3',
    units: [
      { title: 'Geometry', topics: ['Rolling and Sliding', 'Classification of objects'], description: 'Observe how objects move and classify them by properties.' },
      { title: 'Numbers', topics: ['Subtracting Zero', 'Subtraction up to 20', 'Numbers from 21 to 99', 'Skip counting'], description: 'Mastering larger numbers and skip counting by 2s and 3s.' },
      { title: 'Money', topics: ['Coins', 'Currency notes'], description: 'Introduction to the Indian Rupee symbols and values.' },
      { title: 'Time', topics: ['Day and Night', 'Earlier - Later', 'Fast - Slow'], description: 'Understanding durations and sequences of events.' },
      { title: 'Information Processing', topics: ['Assembling Parts', 'Formation of Pictures', 'Formulating Instructions'], description: 'Creative building and following step-by-step guides.' }
    ]
  }
];

export const TN_CLASS_1_EVS: TermSyllabus[] = [
  {
    term: 'Term 1',
    units: [
      { title: 'Living and Non-living Things', topics: ['Eat, Grow, Move', 'Sense and Feel'], description: 'Discover what makes something alive!' },
      { title: 'My Wonderful Body', topics: ['External Parts', 'Senses', 'Personal Hygiene'], description: 'Learn about your body and how to keep it clean.' },
      { title: 'Nature\'s Bounty', topics: ['Leaves', 'Flowers', 'Vegetables', 'Fruits'], description: 'Explore the beautiful world of plants around us.' },
      { title: 'Animals Around Us', topics: ['Mammals', 'Birds', 'Insects', 'Animal Care'], description: 'Meet our furry and feathered friends.' }
    ]
  },
  {
    term: 'Term 2',
    units: [
      { title: 'Our Delicious Food', topics: ['Importance of Food', 'Grains', 'Healthy Habits', 'Journey of Rice'], description: 'Learn where our food comes from and why it is important.' },
      { title: 'Water', topics: ['Uses of Water', 'Saving Water', 'Safe Drinking Water'], description: 'Water is life. Let\'s learn how to conserve it.' },
      { title: 'Our Society', topics: ['Festivals', 'Our Friends - Community Helpers'], description: 'Celebrate our culture and the people who help us.' }
    ]
  },
  {
    term: 'Term 3',
    units: [
      { title: 'Materials Around Us', topics: ['Wood', 'Clay', 'Stone', 'Sand', 'Metals'], description: 'Everything is made of something. Let\'s touch and learn!' },
      { title: 'Our Neighbourhood', topics: ['Habitats', 'Safety at School', 'Safety at Home'], description: 'Know your surroundings and stay safe.' },
      { title: 'Transport', topics: ['Modes of Transport', 'Story of Transport', 'Road Safety'], description: 'How we move from one place to another.' },
      { title: 'Day and Night', topics: ['Sun, Moon and Stars', 'Rain, Thunder and Lightning'], description: 'The wonders of the sky.' },
      { title: 'Science in Everyday Life', topics: ['Clothes and Seasons', 'Uniforms', 'Washing Clothes'], description: 'Science is in everything we do daily.' }
    ]
  }
];

export const TN_CLASS_2_MATH: TermSyllabus[] = [
  {
    term: 'Term 1',
    units: [
      { title: 'Geometry', topics: ['Shapes', 'Lines', 'Patterns'], description: 'Understanding shapes, lines, and patterns in our environment.' },
      { title: 'Numbers', topics: ['Counting', 'Place Value', 'Number Names'], description: 'Introduction to numbers up to 100.' },
      { title: 'Patterns', topics: ['Visual Patterns', 'Number Patterns'], description: 'Repeating patterns in colors, shapes, and numbers.' }
    ]
  },
  {
    term: 'Term 2',
    units: [
      { title: 'Numbers (Addition)', topics: ['Addition up to 20', 'Grouping'], description: 'Learning basic addition techniques.' },
      { title: 'Measurements', topics: ['Measuring Length', 'Comparing Weights'], description: 'Introduction to length, weight, and capacity.' },
      { title: 'Time', topics: ['Days of the week', 'Months of the year'], description: 'Understanding days and months.' }
    ]
  },
  {
    term: 'Term 3',
    units: [
      { title: 'Numbers (Subtraction)', topics: ['Subtraction within 20', 'Word Problems'], description: 'Learning basic subtraction techniques.' },
      { title: 'Money', topics: ['Identifying Coins', 'Simple Transactions'], description: 'Introduction to coins and notes.' },
      { title: 'Information Processing', topics: ['Data Collection', 'Simple Charts'], description: 'Collecting and organizing simple data.' }
    ]
  }
];

export const TN_CLASS_2_EVS: TermSyllabus[] = [
  {
    term: 'Term 1',
    units: [
      { title: 'Our Environment', topics: ['My Surroundings', 'Keeping it Clean'], description: 'Learning about our surroundings.' },
      { title: 'My Body', topics: ['Internal and External Parts', 'Senses'], description: 'Understanding our body parts and their functions.' }
    ]
  },
  {
    term: 'Term 2',
    units: [
      { title: 'Plants around Us', topics: ['Trees', 'Shrubs', 'Herbs'], description: 'Introduction to types of plants.' },
      { title: 'Animals around Us', topics: ['Farm Animals', 'Wild Animals', 'Birds'], description: 'Understanding domestic and wild animals.' }
    ]
  },
  {
    term: 'Term 3',
    units: [
      { title: 'Food and Health', topics: ['Types of Food', 'Clean Water'], description: 'Learning about healthy eating habits.' },
      { title: 'The Sky', topics: ['Day Sky', 'Night Sky'], description: 'Observing the sun, moon, and stars.' }
    ]
  }
];

export const TN_CLASS_3_MATH: TermSyllabus[] = [
  {
    term: 'Term 1',
    units: [
      { title: 'Geometry', topics: ['Basic Shapes', 'Drawing Lines', 'Patterns'], description: 'Exploring the world of shapes and lines.' },
      { title: 'Numbers', topics: ['Numbers up to 1000', 'Place Value', 'Comparison'], description: 'Learning about hundreds and thousands.' }
    ]
  },
  {
    term: 'Term 2',
    units: [
      { title: 'Addition', topics: ['Addition with carrying', 'Word Problems'], description: 'Mastering the art of summing up numbers.' },
      { title: 'Subtraction', topics: ['Subtraction with borrowing', 'Life problems'], description: 'Learning how to find the difference.' }
    ]
  },
  {
    term: 'Term 3',
    units: [
      { title: 'Multiplication', topics: ['Product', 'Introduction to Tables'], description: 'Learning repeated addition as multiplication.' },
      { title: 'Time and Money', topics: ['Reading Clock', 'Making Bills'], description: 'Practical math for daily life.' }
    ]
  }
];

export const TN_CLASS_3_EVS: TermSyllabus[] = [
  {
    term: 'Term 1',
    units: [
      { title: 'The Animal Kingdom', topics: ['Habitats', 'Food Habits of Animals'], description: 'Discovering how animals live.' },
      { title: 'Plants around Us', topics: ['Parts of a Plant', 'Flowers and Fruits'], description: 'Exploring the green world.' }
    ]
  },
  {
    term: 'Term 2',
    units: [
      { title: 'Human Body and Senses', topics: ['Organs', 'Taking Care of Body'], description: 'Understanding how we function.' },
      { title: 'Work and Services', topics: ['Our Helpers', 'Public Places'], description: 'Learning about the community.' }
    ]
  },
  {
    term: 'Term 3',
    units: [
      { title: 'Food', topics: ['Balanced Diet', 'Cooking Methods'], description: 'Healthy eating habits.' },
      { title: 'Our World', topics: ['Continents', 'Oceans', 'Maps'], description: 'A big look at our planet.' }
    ]
  }
];
