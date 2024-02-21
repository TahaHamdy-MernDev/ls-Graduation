import React, { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoursesAction } from "../Redux/Action/courseAction";
import { getAllBookAction } from "../Redux/Action/bookAction";
import { getAllCategoriesAction } from "../Redux/Action/categoryAction";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

export const CategorySearch = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchCoursesAction());
    dispatch(getAllBookAction());
    dispatch(getAllCategoriesAction());
  }, [dispatch]);

  const { courses } = useSelector((state) => state.course);
  const { books } = useSelector((state) => state.book);

  const coursesWithThisCategory = courses?.filter(
    (course) => course.category._id === category
  );
  const booksWithThisCategory = books?.filter(
    (book) => book.category._id === category
  );
  const styles = {
    display:booksWithThisCategory?.length === 0 ||booksWithThisCategory?.length ===undefined? "flex" :"initial",
    flexWrap: "wrap",
    gap: "2rem",
    justifyContent: "center",
  };

  const calculateAverageRating = (ratings) => {
    if (ratings?.length === 0) {
      return 0;
    }
    const totalRating = ratings?.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    const averageRating = totalRating / ratings?.length;
    return averageRating.toFixed(1);
  };

  const renderCourses = () => {
    return (
      <>
        <h1 className="mb-2">{t("homePage.course")}</h1>
        <span style={ styles}>
          {coursesWithThisCategory && coursesWithThisCategory.length > 0 ? (
            coursesWithThisCategory.map((course, index) => (
              <Link
                style={{ textDecoration: "none" }}
                key={index}
                to={`/course-details/${course._id}`}
              >
                <div
                  className="d-flex justify-items-start gap-2"
                  style={{
                    border: "1px solid #ccc",
                    marginTop: ".5rem",
                    marginBottom: ".5rem",
                    height: "15rem",
                    width: "35rem",
                    backgroundColor: "lightblue",
                    fontSize: "1.2rem",
                    borderRadius: "8px",
                  }}
                >
                  <Card.Img
                    style={{
                      width: "50%",
                      height: "100%",
                      borderRadius: "8px",
                    }}
                    src={course.image.url}
                  />
                  <Card.Body style={{ padding: "1rem", textAlign: "left" }}>
                    <h5 > {course.name}</h5>
                    <Card.Text>Instructor: {course.instructor}</Card.Text>
                    <Card.Text>level: {course.level}</Card.Text>
                    <Card.Text>
                      Duration: {course.duration.value + course.duration.unit}
                    </Card.Text>
                    <Card.Text>Price: ${course.price}</Card.Text>
                  </Card.Body>
                </div>
              </Link>
            ))
          ) : (
            t("homePage.noCoursesMessage")
          )}
        </span>
      </>
    );
  };

  const renderBooks = () => {
    return (
      <>
        <h1 className="mb-2">{t("homePage.book")}</h1>
        <span style={coursesWithThisCategory?.length === 0 ? styles : null}>
          {booksWithThisCategory && booksWithThisCategory.length > 0 ? (
            booksWithThisCategory.map((book, index) => (
              <Link
                style={{ textDecoration: "none" }}
                key={index}
                to={`/book-details/${book._id}`}
              >
                <div
                  className="d-flex justify-items-start gap-2"
                  style={{
                    border: "1px solid #ccc",
                    marginTop: ".5rem",
                    marginBottom: ".5rem",
                    height: "15rem",
                    width: "35rem",
                    backgroundColor: "lightblue",
                    fontSize: "1.2rem",
                    borderRadius: "8px",
                  }}
                >
                  <Card.Img
                    style={{
                      width: "30%",
                      height: "100%",
                      borderRadius: "8px",
                    }}
                    src={book.coverImage.url}
                  />
                  <Card.Body style={{ padding: "1rem", textAlign: "left" }}>
                    <h5>{book.title}</h5>
                    <Card.Text>Author: {book.author}</Card.Text>
                    <Card.Text>Downloads: {book.downloads}</Card.Text>
                    <Card.Text>
                      Rate: {calculateAverageRating(book.ratings)}
                    </Card.Text>
                  </Card.Body>
                </div>
              </Link>
            ))
          ) : (
            t("homePage.noCoursesMessage")
          )}
        </span>
      </>
    );
  };

  return (
    <Container className="mt-5" dir={i18n.dir()}>
      <Row style={{ minHeight: "100vh", gap: "5px" }}>
        {coursesWithThisCategory?.length > 0 && (
          <Col
            style={{
              backgroundColor: "#f4f4f4",
              borderRadius: "10px",
              padding: "10px",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {renderCourses()}
          </Col>
        )}
        {booksWithThisCategory?.length === 0 &&
          coursesWithThisCategory?.length === 0 && (
            <Col>
              <h4>لا يوجود شىء لعرضه</h4>
            </Col>
          )}
        {booksWithThisCategory?.length > 0 && (
          <Col
            style={{
              backgroundColor: "#f4f4f4",
              borderRadius: "10px",
              padding: "10px",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {renderBooks()}
          </Col>
        )}
      </Row>
    </Container>
  );
};
