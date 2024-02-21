//wsl
import { Container, Row, Button } from "react-bootstrap";
// import BookTable from "./booksTable";
import { Link } from "react-router-dom";
import CourseTable from "./coursesTable";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCoursesSuggestions } from "../../Redux/Action/courseAction";

function AdminCourse() {
  const { t } = useTranslation();
 
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCoursesSuggestions());
  }, [dispatch]);
   const { suggestions } = useSelector((state) => state.course);

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <div className="admin-course-page d-flex justify-content-between align-items-center mb-3">
          <h2>{t('manageCourses.title')}</h2>
          <span className="d-flex gap-2">
          {suggestions && suggestions.length > 0 && (
              <Link to="/all-suggestions-courses">
                <Button className="btn btn-primary">
                  {t("Suggest.showSuggestions")}
                </Button>
              </Link>
            )}
             <Link to="/create-course">
            <Button className="btn btn-primary">{t('addCourse.addNewCourse')}</Button>
          </Link>
          </span>
         
        </div>
      </Row>

      <Row>
     
          <CourseTable />
      </Row>
    </Container>
  );
}

export default AdminCourse;
