import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Combined import
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchCoursesAction } from "../Redux/Action/courseAction"; // Check if needed
import { getAllBookAction } from "../Redux/Action/bookAction"; // Check if needed
import { Col, Container, Row } from "react-bootstrap";
import BookCard from "./Books/bookCard"; // Check if needed
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import demy from "../images/book2.jpg"; // Check if needed
import { FaDownload } from "react-icons/fa";
import RatingComponent from "./rate";
import { userSearchAction } from "../Redux/Action/userAction";

const SearchResults = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchIn = queryParams.get("in");
  const searchText = queryParams.get("search");

  const getDisplayText = () => {
    switch (searchIn) {
      case "books":
        return "كتب";
      case "courses":
        return "الدورات";
      default:
        return "اختر"; // Default text
    }
  };

  const { searchResult } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(userSearchAction({ searchIn, searchText }));
  }, [dispatch, searchIn, searchText]);

  console.log(searchResult);

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

  const navigate = useNavigate();

  return (
    <Container className="mt-4 search__container" dir={i18n.dir()}>
      <div
        style={{ background: "#ffff", padding: "1rem", borderRadius: "8px" }}
      >
        <Row className="search__header">
          <h1 className="search__title">{t('search.siteSearch')}</h1>
          <p className="search__description">
          {t('search.searchResultsFor')} {searchText} {t("search.in")} {getDisplayText()}.
          </p>
        </Row>
        <Row className="search__result-count">
          <p>{t('search.resultsFound')} {searchResult?.length || 0}</p>
        </Row>
      </div>
      <div className="search__result-container grid-container">
        {searchIn === "books" ? (
          searchResult && searchResult.length > 0 ? (
            searchResult.map((book, index) => (
              <div key={index} className="search__card">
                <div className="card__book">
                  <div className="book__card-content">
                    <h2 onClick={() => navigate(`/book-details/${book._id}`)}>
                      {book.title}
                    </h2>
                    <p>
                      {book.downloads} <FaDownload />
                    </p>
                    <p>{t('search.by')} {book.author}</p>
                    <p className="book__card-description">{book.description}</p>
                    <p>({book.reviews?.length}) {t('search.reviews')}</p>
                    <RatingComponent
                      size="22px"
                      edit={false}
                      initialRating={calculateAverageRating(book.ratings)}
                    />
                  </div>
                  <img
                    className="book__card-img"
                    src={book.coverImage.url}
                    alt=""
                  />
                </div>
              </div>
            ))
          ) : (
            <h2>{t('search.noBooksToPreview')}</h2>
          )
        ) : (
          searchResult &&
          searchResult.length > 0 &&
          searchResult.map((course, index) => (
            <div key={index} className="search__card">
              <div className="search__card-course">
                <img
                  className="search__card-course__img"
                  src={course.image.url}
                  alt={`course-${course._id}`}
                />
                <div className="course__content">
                  <h4 onClick={() => navigate(`/course-details/${course._id}`)}>
                    {course.name}
                  </h4>
                  <p>{course.description}</p>
                  <p>{t('search.author')} {course.author}</p>
                  <p>
                    {" "}
                    <strong>{t('search.level')} </strong> {course.level}
                  </p>
                  <RatingComponent
                    size="22px"
                    edit={false}
                    initialRating={calculateAverageRating(course.ratings)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
};

export default SearchResults;
