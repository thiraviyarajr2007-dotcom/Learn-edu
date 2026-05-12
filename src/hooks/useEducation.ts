import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  serverTimestamp,
  orderBy,
  addDoc,
  getDoc,
  limit,
  collectionGroup,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth, UserProfile } from '../context/AuthContext';
import { TN_CLASS_1_MATH, TN_CLASS_1_EVS, TN_CLASS_2_MATH, TN_CLASS_2_EVS, TN_CLASS_3_MATH, TN_CLASS_3_EVS } from '../data/tn_syllabus';

export interface Course {
  id: string;
  title: string;
  description: string;
  syllabusId: 'CBSE' | 'TN State Board';
  grade: string;
  term: 'Term 1' | 'Term 2' | 'Term 3' | 'Full Year';
  subject: string;
  teacherId: string;
  coverImage?: string;
  tags?: string[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  tags?: string[];
}

export interface Progress {
  userId: string;
  moduleId: string;
  courseId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  updatedAt: any;
}

export interface Interaction {
  id: string;
  courseId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: any;
  role: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  totalPoints: number;
  timerPerQuestion?: number; // Seconds per question
  questions: {
    id: string;
    type: 'mcq' | 'tf' | 'sa';
    text: string;
    options?: string[];
    correctAnswer: string;
    points: number;
    rationale?: string;
  }[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  courseId: string;
  answers: Record<string, string>;
  score: number;
  totalPossible: number;
  graded: boolean;
  feedback?: string;
  timestamp: any;
}

export interface TeacherAlert {
  id: string;
  userId: string;
  userName: string;
  type: 'performance' | 'attendance';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: any;
}

export interface ForumPost {
  id: string;
  courseId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
  type: 'question' | 'announcement';
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  criteria: string;
  awardedAt: any;
}

export const useEducation = () => {
  const { profile, awardPoints } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const q = profile.role === 'teacher'
      ? query(collection(db, 'courses'), where('teacherId', '==', profile.uid))
      : query(collection(db, 'courses'), where('syllabusId', '==', profile.syllabus));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setCourses(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'courses');
    });

    return () => unsubscribe();
  }, [profile]);

  const updateProgress = async (courseId: string, moduleId: string, status: Progress['status']) => {
    if (!profile) return;
    const progressId = `${profile.uid}_${moduleId}`;
    const progressRef = doc(db, 'users', profile.uid, 'progress', progressId);
    
    try {
      // Award points for completion
      if (status === 'completed') {
        await awardPoints(50);
        
        // Award "Quick Learner" badge if it's their first completion
        const firstBadgeId = 'badge_first_module';
        const badgeRef = doc(db, 'users', profile.uid, 'badges', firstBadgeId);
        const bDoc = await getDoc(badgeRef);
        if (!bDoc.exists()) {
          await setDoc(badgeRef, {
            id: firstBadgeId,
            title: 'Foundation Stone',
            icon: '💎',
            criteria: 'Complete your first education module',
            awardedAt: serverTimestamp()
          });
        }
      }

      await setDoc(progressRef, {
        userId: profile.uid,
        moduleId,
        courseId,
        status,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${profile.uid}/progress/${progressId}`);
    }
  };

  const getProgress = (userId: string, callback: (progress: Progress[]) => void) => {
    const q = query(collection(db, 'users', userId, 'progress'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => doc.data() as Progress));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/progress`);
    });
  };

  const sendInteraction = async (courseId: string, message: string) => {
    if (!profile) return;
    const interactionsRef = collection(db, 'courses', courseId, 'interactions');
    try {
      await addDoc(interactionsRef, {
        id: '', // Will be set by Firebase
        courseId,
        senderId: profile.uid,
        senderName: profile.name,
        message: message,
        timestamp: serverTimestamp(),
        role: profile.role
      });
      // Award points for participation
      await awardPoints(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `courses/${courseId}/interactions`);
    }
  };

  const getInteractions = (courseId: string, callback: (msgs: Interaction[]) => void) => {
    const q = query(collection(db, 'courses', courseId, 'interactions'), orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interaction)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/interactions`);
    });
  };

  const getModules = (courseId: string, callback: (modules: Module[]) => void) => {
    const q = query(collection(db, 'courses', courseId, 'modules'), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/modules`);
    });
  };

  // --- Quiz Functions ---
  const getQuizzes = (courseId: string, moduleId: string, callback: (quizzes: Quiz[]) => void) => {
    const q = query(collection(db, 'courses', courseId, 'quizzes'), where('moduleId', '==', moduleId));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/quizzes`);
    });
  };

  const submitQuizAttempt = async (courseId: string, quizId: string, answers: Record<string, string>, questions: Quiz['questions']) => {
    if (!profile) return;
    
    let score = 0;
    let autoGraded = true;
    let totalPossible = 0;

    questions.forEach(q => {
      totalPossible += q.points;
      if (q.type !== 'sa') {
        if (answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
          score += q.points;
        }
      } else {
        autoGraded = false; // Flag for teacher review
      }
    });

    try {
      const attemptRef = collection(db, 'users', profile.uid, 'attempts');
      await addDoc(attemptRef, {
        userId: profile.uid,
        quizId,
        courseId,
        answers,
        score,
        totalPossible,
        graded: autoGraded,
        timestamp: serverTimestamp()
      });

      if (autoGraded) {
        await awardPoints(score * 2);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${profile.uid}/attempts`);
    }
  };

  const getAttempts = (userId: string, quizId: string, callback: (attempts: QuizAttempt[]) => void) => {
    const q = query(collection(db, 'users', userId, 'attempts'), where('quizId', '==', quizId));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizAttempt)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/attempts`);
    });
  };

  // --- Forum Functions ---
  const createForumPost = async (courseId: string, title: string, content: string, type: ForumPost['type']) => {
    if (!profile) return;
    const postsRef = collection(db, 'courses', courseId, 'posts');
    try {
      await addDoc(postsRef, {
        courseId,
        title,
        content,
        authorId: profile.uid,
        authorName: profile.name,
        createdAt: serverTimestamp(),
        type
      });
      await awardPoints(10);

      // Award "Social Butterfly" badge for first post
      const socialBadgeId = 'badge_social_butterfly';
      const badgeRef = doc(db, 'users', profile.uid, 'badges', socialBadgeId);
      const bDoc = await getDoc(badgeRef);
      if (!bDoc.exists()) {
        await setDoc(badgeRef, {
          id: socialBadgeId,
          title: 'Social Butterfly',
          icon: '🦋',
          criteria: 'Ignite your first academic debate',
          awardedAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `courses/${courseId}/posts`);
    }
  };

  const getForumPosts = (courseId: string, callback: (posts: ForumPost[]) => void) => {
    const q = query(collection(db, 'courses', courseId, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ForumPost)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/posts`);
    });
  };

  const addForumReply = async (courseId: string, postId: string, content: string) => {
    if (!profile) return;
    const repliesRef = collection(db, 'courses', courseId, 'posts', postId, 'replies');
    try {
      await addDoc(repliesRef, {
        postId,
        content,
        authorId: profile.uid,
        authorName: profile.name,
        createdAt: serverTimestamp()
      });
      await awardPoints(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `courses/${courseId}/posts/${postId}/replies`);
    }
  };

  const getForumReplies = (courseId: string, postId: string, callback: (replies: ForumReply[]) => void) => {
    const q = query(collection(db, 'courses', courseId, 'posts', postId, 'replies'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ForumReply)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/posts/${postId}/replies`);
    });
  };

  const getBadges = (userId: string, callback: (badges: Badge[]) => void) => {
    const q = query(collection(db, 'users', userId, 'badges'), orderBy('awardedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/badges`);
    });
  };

  const getLeaderboard = (callback: (users: UserProfile[]) => void) => {
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(5));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => doc.data() as UserProfile));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users/leaderboard');
    });
  };

  const getRecommendations = () => {
    if (!profile) return [];
    
    // Simple recommendation engine:
    // 1. Matches syllabus
    // 2. Prioritizes courses that contain user's interests in title/description/tags
    // 3. Excludes fully completed courses
    
    const userInterests = profile.interests || [];
    const recommended = courses.filter(course => {
      const matchesSyllabus = course.syllabusId === profile.syllabus;
      const hasInterestMatch = userInterests.some(interest => 
        course.title.toLowerCase().includes(interest.toLowerCase()) ||
        course.description.toLowerCase().includes(interest.toLowerCase()) ||
        course.tags?.some(tag => tag.toLowerCase() === interest.toLowerCase())
      );
      return matchesSyllabus && hasInterestMatch;
    });

    return recommended.length > 0 ? recommended : courses.filter(c => c.syllabusId === profile.syllabus).slice(0, 2);
  };

  const getTeacherReviews = (courseId: string, callback: (attempts: QuizAttempt[]) => void) => {
    const q = query(
      collectionGroup(db, 'attempts'), 
      where('courseId', '==', courseId),
      where('graded', '==', false)
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizAttempt)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'attempts/review');
    });
  };

  const gradeAttempt = async (userId: string, attemptId: string, additionalPoints: number, feedback: string) => {
    const attemptRef = doc(db, 'users', userId, 'attempts', attemptId);
    const attemptSnap = await getDoc(attemptRef);
    const attemptData = attemptSnap.data() as QuizAttempt;
    
    const finalScore = (attemptData?.score || 0) + additionalPoints;
    const scorePct = finalScore / (attemptData?.totalPossible || 1);

    await setDoc(attemptRef, { 
      score: finalScore,
      graded: true,
      feedback 
    }, { merge: true });
    
    // Update user points
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { points: increment(additionalPoints * 2) }, { merge: true });

    // Auto-create alert if score is low (< 40%)
    if (scorePct < 0.4) {
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as UserProfile;
      const alertsRef = collection(db, 'users', userId, 'alerts');
      await addDoc(alertsRef, {
        userId,
        userName: userData.name,
        type: 'performance',
        severity: 'high',
        message: `Student scored ${Math.round(scorePct * 100)}% on a quiz. Remedial intervention recommended.`,
        timestamp: serverTimestamp()
      });
    }
  };

  const getStudentAnalysis = (userId: string, callback: (analysis: { type: string, score: number, weakTags: string[] }) => void) => {
    const q = query(collection(db, 'users', userId, 'attempts'), orderBy('timestamp', 'desc'), limit(10));
    return onSnapshot(q, (snapshot) => {
      const attempts = snapshot.docs.map(doc => doc.data() as QuizAttempt);
      if (attempts.length === 0) {
        callback({ type: 'Neutral', score: 0, weakTags: [] });
        return;
      }

      const totalScore = attempts.reduce((acc, curr) => acc + (curr.score / (curr.totalPossible || 1)), 0);
      const avgScore = totalScore / attempts.length;

      let type = 'Average';
      if (avgScore > 0.85) type = 'Fast';
      else if (avgScore < 0.5) type = 'Slow';

      callback({ type, score: Math.round(avgScore * 100), weakTags: [] });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/analysis`);
    });
  };

  const getTeacherAlerts = (callback: (alerts: TeacherAlert[]) => void) => {
    const q = query(collectionGroup(db, 'alerts'), orderBy('timestamp', 'desc'), limit(20));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeacherAlert)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'alerts');
    });
  };

  const seedData = async () => {
    if (!profile || profile.role !== 'teacher') return;
    
    // Seed TN State Board Curriculum
    const tnCurriculum = [
      { grade: 'Class 1', subjects: [{ name: 'Mathematics', data: TN_CLASS_1_MATH }, { name: 'Environmental Science', data: TN_CLASS_1_EVS }] },
      { grade: 'Class 2', subjects: [{ name: 'Mathematics', data: TN_CLASS_2_MATH }, { name: 'Environmental Science', data: TN_CLASS_2_EVS }] },
      { grade: 'Class 3', subjects: [{ name: 'Mathematics', data: TN_CLASS_3_MATH }, { name: 'Environmental Science', data: TN_CLASS_3_EVS }] }
    ];

    // High quality modules from JSON for Class 1 Math/EVS
    const highQualityContent = [
      {
        "chapter_name": "Geometry - Comparisons",
        "subject": "Mathematics",
        "modules": [
          {
            "module_id": "math_c1_t1_g1",
            "topic_name": "Top and Bottom",
            "explanation": "Look at the slide! The boy at the peak is at the TOP. The boy finishing the slide is at the BOTTOM. The red book in a stack is at the bottom, while the blue one is at the top. Can you spot the bird on the top of the tree?",
            "questions": [
              { "id": "q1", "type": "mcq", "text": "A bird sitting on the highest branch of a tree is at the...?", "options": ["Top", "Bottom", "Inside", "Outside"], "correctAnswer": "Top", "points": 10 },
              { "id": "q2", "type": "mcq", "text": "The shoes on the floor at the base of a ladder are at the...?", "options": ["Top", "Bottom", "Above", "Below"], "correctAnswer": "Bottom", "points": 10 },
              { "id": "q3", "type": "mcq", "text": "If you are at the start of a slide, you are at the...?", "options": ["Bottom", "Middle", "Near", "Top"], "correctAnswer": "Top", "points": 10 }
            ]
          },
          {
            "module_id": "math_c1_t1_g2",
            "topic_name": "Inside and Outside",
            "explanation": "Fruits like Papaya have seeds INSIDE. A Nut like Cashew has its nut OUTSIDE. When you are in your room, you are inside. When you play in the garden, you are outside.",
            "questions": [
              { "id": "q1", "type": "mcq", "text": "An eraser kept in a pencil box is...?", "options": ["Inside", "Outside", "Top", "Bottom"], "correctAnswer": "Inside", "points": 10 },
              { "id": "q2", "type": "mcq", "text": "A dog sitting in its kennel is...?", "options": ["Outside", "Above", "Below", "Inside"], "correctAnswer": "Inside", "points": 10 },
              { "id": "q3", "type": "mcq", "text": "The seeds of an apple are found...?", "options": ["Inside", "Outside", "Top", "Bottom"], "correctAnswer": "Inside", "points": 10 }
            ]
          },
          {
            "module_id": "math_c1_t1_g_comp",
            "topic_name": "Geometry Comparison Challenge",
            "explanation": "Let's test what we've learned about Top, Bottom, Inside, and Outside! Remember, Top is the highest point, Bottom is the lowest. Inside means contained within something, and Outside means exterior to it.",
            "is_special_quiz": true,
            "questions": [
              { "id": "gc1", "type": "mcq", "text": "A monkey sitting on the highest branch of a tree is at the...?", "options": ["Top", "Bottom", "Inside", "Outside"], "correctAnswer": "Top", "points": 10, "rationale": "The highest part of anything is considered the 'Top'." },
              { "id": "gc2", "type": "mcq", "text": "A mouse hiding in a small hole in the wall is...?", "options": ["Top", "Bottom", "Inside", "Outside"], "correctAnswer": "Inside", "points": 10, "rationale": "When something is within an enclosed space like a hole, it is 'Inside'." },
              { "id": "gc3", "type": "mcq", "text": "The roots of a big tree are deep under the ground at the...?", "options": ["Top", "Bottom", "Inside", "Outside"], "correctAnswer": "Bottom", "points": 10, "rationale": "The underground part of the tree is its base or 'Bottom'." },
              { "id": "gc4", "type": "mcq", "text": "When you are playing in the open park, you are...?", "options": ["Top", "Bottom", "Inside", "Outside"], "correctAnswer": "Outside", "points": 10, "rationale": "Open spaces not enclosed by walls are 'Outside'." },
              { "id": "gc5", "type": "mcq", "text": "A flag flying high at the peak of a mountain is at the...?", "options": ["Top", "Bottom", "Inside", "Outside"], "correctAnswer": "Top", "points": 10, "rationale": "The peak of a mountain is its 'Top' point." }
            ]
          }
        ]
      },
      {
        "chapter_name": "Numbers - 1 to 9",
        "subject": "Mathematics",
        "modules": [
          {
            "module_id": "math_c1_t1_n1",
            "topic_name": "Numbers 1-5",
            "explanation": "Let's count! 1 kitten, 2 birds, 3 monkeys, 4 deer, and 5 clouds. Each number tells us how many objects there are. One bus has 1 bead, four flowers have 4 beads!",
            "questions": [
              { "id": "q1", "type": "mcq", "text": "How many eyes do we have?", "options": ["1", "2", "3", "5"], "correctAnswer": "2", "points": 10 },
              { "id": "q2", "type": "mcq", "text": "What comes after 3?", "options": ["2", "5", "4", "1"], "correctAnswer": "4", "points": 10 },
              { "id": "q3", "type": "mcq", "text": "How many fingers are shown on one full hand?", "options": ["2", "4", "5", "3"], "correctAnswer": "5", "points": 10 }
            ]
          }
        ]
      },
      {
        "chapter_name": "My Wonderful Body",
        "subject": "Environmental Science",
        "modules": [
          {
            "module_id": "evs_c1_t1_b1",
            "topic_name": "Our Senses",
            "explanation": "We have 5 sense organs that help us know the world! Eyes to SEE, Ears to HEAR, Nose to SMELL, Tongue to TASTE, and Skin to FEEL.",
            "questions": [
              { "id": "q1", "type": "mcq", "text": "Which body part helps us see colors?", "options": ["Ears", "Nose", "Eyes", "Tongue"], "correctAnswer": "Eyes", "points": 10 },
              { "id": "q2", "type": "mcq", "text": "What do we use to hear a bell?", "options": ["Ears", "Eyes", "Hands", "Legs"], "correctAnswer": "Ears", "points": 10 },
              { "id": "q3", "type": "mcq", "text": "We taste a sweet mango with our...?", "options": ["Nose", "Tongue", "Skin", "Eyes"], "correctAnswer": "Tongue", "points": 10 }
            ]
          }
        ]
      }
    ];

    for (const hq of highQualityContent) {
      const courseId = `tn_board_class_1_${hq.subject.toLowerCase().replace(/ /g, '_')}_term_1_${hq.chapter_name.toLowerCase().replace(/ /g, '_')}`;
      const courseRef = doc(db, 'courses', courseId);
      await setDoc(courseRef, {
        id: courseId,
        title: `${hq.subject}: ${hq.chapter_name} (Term 1)`,
        description: `Interactive learning path for ${hq.chapter_name}`,
        syllabusId: 'TN State Board',
        grade: 'Class 1',
        term: 'Term 1',
        subject: hq.subject,
        teacherId: profile.uid,
        coverImage: '',
        tags: [hq.subject, hq.chapter_name, 'Term 1', 'Class 1'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      for (const [idx, mod] of hq.modules.entries()) {
        const moduleId = mod.module_id;
        const modRef = doc(db, 'courses', courseId, 'modules', moduleId);
        await setDoc(modRef, {
          id: moduleId,
          courseId,
          title: mod.topic_name,
          content: `# ${mod.topic_name}\n\n${mod.explanation}\n\n[QUIZ_PLACEHOLDER]`,
          order: idx + 1,
          tags: [hq.subject, mod.topic_name, 'Class 1'],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        const quizId = mod.module_id === 'math_c1_t1_g_comp' ? 'quiz_geometry_comparison_module' : `quiz_${moduleId}`;
        const quizRef = doc(db, 'courses', courseId, 'quizzes', quizId);
        await setDoc(quizRef, {
          id: quizId,
          moduleId,
          courseId,
          title: mod.module_id === 'math_c1_t1_g_comp' ? 'Geometry Comparison: Final Review' : `${mod.topic_name} Check`,
          totalPoints: mod.questions.length * 10,
          timerPerQuestion: mod.module_id === 'math_c1_t1_g_comp' ? 30 : 0,
          questions: mod.questions,
          createdAt: serverTimestamp()
        });
      }
    }

    for (const entry of tnCurriculum) {
      for (const sub of entry.subjects) {
        for (const termInfo of sub.data) {
          for (const unit of termInfo.units) {
            const courseId = `tn_board_${entry.grade.toLowerCase().replace(/ /g, '_')}_${sub.name.toLowerCase().replace(/ /g, '_')}_${termInfo.term.toLowerCase().replace(/ /g, '_')}_${unit.title.toLowerCase().replace(/ /g, '_')}`;
            const courseRef = doc(db, 'courses', courseId);
            await setDoc(courseRef, {
              id: courseId,
              title: `${sub.name}: ${unit.title} (${termInfo.term})`,
              description: unit.description,
              syllabusId: 'TN State Board',
              grade: entry.grade,
              term: termInfo.term,
              subject: sub.name,
              teacherId: profile.uid,
              coverImage: '',
              tags: [sub.name, unit.title, termInfo.term, entry.grade],
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });

            for (const [idx, topic] of unit.topics.entries()) {
              const moduleId = `${courseId}_mod_${idx}`;
              const modRef = doc(db, 'courses', courseId, 'modules', moduleId);
              await setDoc(modRef, {
                id: moduleId,
                courseId,
                title: topic,
                content: `# ${topic}\nThis is a placeholder for learning content about ${topic} in ${sub.name} ${entry.grade} ${termInfo.term}. \n\n[QUIZ_PLACEHOLDER]`,
                order: idx + 1,
                tags: [sub.name, topic, entry.grade],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });

              // Interactive Quiz
              const quizId = `quiz_${moduleId}`;
              const quizRef = doc(db, 'courses', courseId, 'quizzes', quizId);

              // Specific Questions for Class 1 Topics
              let class1Qs: Quiz['questions'] = [
                { id: 'v1', type: 'mcq', text: 'What is the best first step while learning Mathematics?', options: ['Understand the concept', 'Memorize formulas', 'Skip to exercises'], correctAnswer: 'Understand the concept', points: 10 },
                { id: 'v2', type: 'mcq', text: 'After watching a lesson, what should you do next?', options: ['Solve practice problems', 'Close the book', 'Watch another video'], correctAnswer: 'Solve practice problems', points: 10 }
              ];

              if (entry.grade === 'Class 1') {
                if (sub.name === 'Mathematics') {
                  if (topic.includes('Shapes') || topic.includes('Geometry')) {
                    class1Qs = [
                      { id: 's1', type: 'mcq', text: 'Which shape looks like a football?', options: ['Square', 'Circle', 'Triangle'], correctAnswer: 'Circle', points: 10 },
                      { id: 's2', type: 'tf', text: 'Does a triangle have 3 corners?', correctAnswer: 'True', points: 10 }
                    ];
                  } else if (topic.includes('Numbers')) {
                    class1Qs = [
                      { id: 'n1', type: 'mcq', text: 'How many apples are there?', options: ['3', '5', '1'], correctAnswer: '5', points: 10 },
                      { id: 'n2', type: 'mcq', text: 'What comes after 5?', options: ['4', '6', '7'], correctAnswer: '6', points: 10 },
                      { id: 'n3', type: 'mcq', text: '3 + 2 = ?', options: ['4', '5', '6'], correctAnswer: '5', points: 10 }
                    ];
                  } else if (topic.includes('Comparisons')) {
                     class1Qs = [
                       { id: 'c1', type: 'mcq', text: 'A bird on the roof is at the...?', options: ['Top', 'Bottom'], correctAnswer: 'Top', points: 10 },
                       { id: 'c2', type: 'mcq', text: 'A dog under the table is at the...?', options: ['Top', 'Bottom'], correctAnswer: 'Bottom', points: 10 }
                     ];
                  }
                } else if (sub.name === 'Environmental Science') {
                   if (topic.includes('Body') || topic.includes('Sens')) {
                    class1Qs = [
                      { id: 'b1', type: 'mcq', text: 'Which part of the body helps us see?', options: ['Ears', 'Nose', 'Eyes'], correctAnswer: 'Eyes', points: 10 },
                      { id: 'b2', type: 'tf', text: 'We have two hands.', correctAnswer: 'True', points: 10 }
                    ];
                  } else if (topic.includes('Living') || topic.includes('Animals') || topic.includes('Nature')) {
                    class1Qs = [
                      { id: 'l1', type: 'mcq', text: 'Which of these needs food to grow?', options: ['Stone', 'Dog', 'Chair'], correctAnswer: 'Dog', points: 10 },
                      { id: 'l2', type: 'tf', text: 'Plants are living things.', correctAnswer: 'True', points: 10 }
                    ];
                  }
                }
              }

              await setDoc(quizRef, {
                id: quizId,
                moduleId,
                courseId,
                title: `${topic} Challenge`,
                totalPoints: class1Qs.reduce((acc, q) => acc + q.points, 0),
                questions: class1Qs,
                createdAt: serverTimestamp()
              });
            }
          }
        }
      }
    }
    
    alert('TN State Board curriculum (Class 1 & 2) has been initialized!');
  };

  return { 
    courses, 
    loading, 
    updateProgress, 
    getProgress, 
    sendInteraction, 
    getInteractions,
    getModules,
    getQuizzes,
    submitQuizAttempt,
    getAttempts,
    createForumPost,
    getForumPosts,
    addForumReply,
    getForumReplies,
    getBadges,
    getLeaderboard,
    getRecommendations,
    getTeacherReviews,
    gradeAttempt,
    getStudentAnalysis,
    getTeacherAlerts,
    seedData
  };
};
