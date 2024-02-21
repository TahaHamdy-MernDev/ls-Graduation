import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import Nav1 from "./component/nav";
import Home from "./component/home";
import Footer from "./component/footer";
import Form1 from "./component/login";
import Registration from "./component/register";

import Codelang from "./component/language";
import Ques from "./component/question";

import AdminPage from "./component/admunpage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUserAction } from "./Redux/Action/userAction";

import AddCategory from "./component/addCategory";

// import DefaultComponent from "./component/test";
import QuestionDetails from "./component/QuestionDetails";
import QuestionPreview from "./component/QuestionDetails";
import SearchResults from "./component/SearchResults";
//Books
import BookDetailPage from "./component/Books/bookDetailPage";
import Book from "./component/Books/books";
import EditBook from "./component/Books/editBook";
import CreateBook from "./component/Books/createBook";
//Suggestions
import AddSuggestions from "./component/Suggestions/addSuggestions";
import { BookSuggestionList } from "./component/Suggestions/BookSuggestionList";
import BookSuggestionPreview from "./component/Suggestions/BookSuggestionPreview";
import { CourseSuggestionList } from "./component/Suggestions/CourseSuggestionList";
//Courses
import AdminCourse from "./component/Courses/admincourse";
import AddCourse from "./component/Courses/addCourse";
import EditCourse from "./component/Courses/editCourse";
import CourseDetails from "./component/Courses/courseDetails";
import Course from "./component/Courses/courses";
import { CourseSuggestionPreview } from "./component/Suggestions/CourseSuggestionPreview";
import { CategorySearch } from "./component/CategorySearch";
import Profile from "./component/profile";
import ProjectPreview from "./component/Code/ProjectPreview";

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(currentUserAction());
  }, [dispatch]);
  return (
    <>
      {" "}
      <Nav1 user={currentUser} />
      <Routes>
        <Route path="/create-book" element={<CreateBook />} />
        <Route path="/comments" element={<QuestionDetails />} />
        <Route path="/edit-book/:id" element={<EditBook />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/book-details/:id" element={<BookDetailPage />} />
        <Route path="/create-course" element={<AddCourse />} />
        <Route path="/edit-course/:id" element={<EditCourse />} />
        <Route path="/admin-course" element={<AdminCourse />} />
        <Route path="/question-preview/:id" element={<QuestionPreview />} />
        {currentUser?.role === "Admin" && (
          <>
           <Route path="/admincourse" element={<AdminCourse />} />
            <Route path="/all-books" element={<AdminPage />} />
            <Route path="/all-suggestions-books" element={<BookSuggestionList />} />
            <Route path="/all-suggestions-courses" element={<CourseSuggestionList />} />
            <Route path="/preview-book/:id" element={<BookSuggestionPreview />} />
            <Route path="/preview-course/:id" element={<CourseSuggestionPreview />} />
          </>
        )}
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/course-details/:id" element={<CourseDetails />} />
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/" /> : <Registration />}
        />
        <Route
          path="/login"
          element={currentUser ? <Navigate to={"/"} /> : <Form1 />}
        />
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Book />} />
        <Route path="/language" element={<Codelang />} />
        <Route path="/question" element={<Ques />} />
        <Route path="/courses" element={<Course />} />
        <Route
          path="/add-suggestions"
          element={currentUser ? <AddSuggestions /> : <Navigate to={"/"} />}
        />
        
        {currentUser?._id &&( 
          <>
          <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/preview-project" element={<ProjectPreview />} />
          </>
        
        ) 

        }
        <Route path="/category/:category" element={<CategorySearch />} />
       
      
       
      </Routes>
      <Footer />
    </>
  );
}

export default App;
