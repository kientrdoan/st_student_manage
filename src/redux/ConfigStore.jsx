import {applyMiddleware, combineReducers, createStore} from 'redux';
import { thunk } from 'redux-thunk';
import { UserReducer } from './reducers/UserRedeucer';
import { SubjectReducer } from './reducers/SubjectRedeucer';
import { ProfileReducer } from './reducers/ProfileRedeucer';
import { CourseReducer } from './reducers/CourseReducer';
import { SemesterReducer } from './reducers/SemesterReducer';
import { EnrollmentReducer } from './reducers/EnrollmentRedeucer';
import { ClassReducer } from './reducers/ClassReducer';
import { ScoreReducer } from './reducers/ScoreReducer';

const dummyReducer = (state = {}, ) => state;

const rootReducer = combineReducers({
  // Add your reducers here
  UserReducer,
  SubjectReducer,
  ProfileReducer,
  CourseReducer,
  SemesterReducer,
  EnrollmentReducer,
  ClassReducer,
  ScoreReducer,
  dummy: dummyReducer
})

export const store= createStore(
  rootReducer, applyMiddleware(thunk)
);