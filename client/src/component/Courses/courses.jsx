import  { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCoursesAction } from "../../Redux/Action/courseAction";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

function Course() {
  const { t } = useTranslation();
  const { courses  } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCoursesAction());
  }, [dispatch]);

  return (
    <Container  dir={i18n.dir()}>
    
      <Row>
      <Col xs>
        <div className="course-edit">
        <h4 className="title1">{t('bestCoursesPage.title')}</h4>
          {courses && courses.length > 0 && (
            <span className="det-para">{t('bestCoursesPage.detailsMessage')}</span>
          )}
          <br />
        </div>
          
        </Col>
      </Row>

      {courses&&courses?.length > 0 ? (
        <Row className="justify-content-center mt-4">
          {courses&&courses.map((course) => (
            <Col lg={4} sm={12} md={6} key={course._id}>
              <Link to={`/course-details/${course._id}`}>
                {course.image ? (
                  <img
                    className="img3"
                    src={`${course.image.url}`}
                    alt={`course-${course._id}`}
                  />
                ) : (
                  <div className="placeholder-image">Placeholder Image</div>
                )}
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="no-courses-message">{t('bestCoursesPage.noCoursesMessage')}</div>
      )}
    </Container>
  );
}

export default Course;
