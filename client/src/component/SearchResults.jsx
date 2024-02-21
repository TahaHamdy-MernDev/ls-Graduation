import  { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { fetchCoursesAction } from "../Redux/Action/courseAction";
import { getAllBookAction } from "../Redux/Action/bookAction";
import { Col, Container, Row } from "react-bootstrap";
import BookCard from "./Books/bookCard";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const selectedCategory = queryParams.get("selectedCategory");
  const { courses } = useSelector((state) => state.course);
  const { books } = useSelector((state) => state.book);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCoursesAction());
    dispatch(getAllBookAction());
  }, [dispatch]);
  const filteredCourses = courses?.filter(
    (course) => course.category.categoryName === selectedCategory
  );
  const filteredBooks = books?.filter(
    (book) => book.category.categoryName === selectedCategory
  );
  return (
    <Container className="mt-4" dir={i18n.dir()}>
      <Row>
        <h3>
        {t("searchResults.pageTitle")}({filteredBooks?.length || filteredCourses?.length})
        </h3>
        <Col className="mt-4">
          <Row className="justify-content-center">
            {category === "course" ? (
              <>
                {" "}
                {filteredCourses?.length > 0 ? (
                  <Row className="justify-content-center">
                    {filteredCourses?.map((course) => (
                      <Col lg={4} sm={12} md={6} key={course._id}>
                        <Link to={`/course-details/${course._id}`}>
                          {course.image ? (
                            <img
                              className="img3"
                              src={`${course.image.url}`}
                              alt={`course-${course._id}`}
                            />
                          ) : (
                            <div className="placeholder-image">
                              Placeholder Image
                            </div>
                          )}
                        </Link>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="no-courses-message">
                    {t("searchResults.noCoursesMessage")}
                  </div>
                )}
              </>
            ): <>
            {filteredBooks?.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
            </>}
            
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchResults;
