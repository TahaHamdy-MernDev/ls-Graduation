import React, { useEffect, useState } from "react";
import "./coursedetails.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoursesAction,
  updateCourseRateByIdAction,
} from "../../Redux/Action/courseAction";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { Rating } from "primereact/rating";
import { FaRegStar } from "react-icons/fa";
import {
  currentUserAction,
  toggleCourseToWishlistAction,
} from "../../Redux/Action/userAction";

function CourseDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(currentUserAction());
    dispatch(fetchCoursesAction());
  }, [dispatch]);
  // const [value, setValue] = useState(null);
  const { t } = useTranslation();
  const courseToPreview = useSelector((state) =>
    state.course.courses.find((course) => course._id === id)
  );

  const userExists = courseToPreview?.ratings.some(
    (rating) => rating?.user === currentUser?._id
  );
  const userRate = userExists
    ? courseToPreview?.ratings?.find(
        (rating) => rating.user === currentUser?._id
      ).rating
    : null;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editRate, setEditRate] = useState(true);
  const [rate, setRate] = useState(0);

  const handleRatingChange = (newRating) => {
    setRate(newRating);
    setShowConfirmation(true);
  };

  const handleConfirmRate = () => {
    // Perform the necessary action to save the rate
    setShowConfirmation(false);
    dispatch(
      updateCourseRateByIdAction({ _id: courseToPreview._id, rating: rate })
    )
      .unwrap()
      .then(() => {
        setEditRate(false);
      });
  };

  const handleCancelRate = () => {
    setRate(0);
    setShowConfirmation(false);
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
  const toggleCourseToWhishList = (id) => {
    // setAlreadyFave(!alreadyFave)
    dispatch(toggleCourseToWishlistAction(id))
      .unwrap()
      .then((res) => {
        dispatch(currentUserAction());
      })
      .catch((err) => {});
  };
  const index = currentUser?.courseWishlist?.findIndex(
    (courseObj) => courseObj._id.toString() === courseToPreview?._id.toString()
  );
  return (
    <Container className="allcourse" dir={i18n.dir()}>
      <Row className="">
        <Col lg={12} md={12} sm={12}>
          <div className="header-title"></div>
        </Col>
      </Row>
      <Row className="justify-content-start p-2" style={{borderRadius:"8px"}}>
        <Col lg={6} md={6} sm={12}>
          {/* Assuming you have an image URL in the course data */}
          <div className="course-details">
            <div className="details">
              <img
                className="mb-2 course__details-img"
                src={courseToPreview?.image.url}
                alt="course-logo"
              />
              <div>
                <h4>
                  {courseToPreview?.name}{" "}
                  <span style={{ color: "#000" }}>
                    {calculateAverageRating(courseToPreview?.ratings)}
                  </span>
                  {/* <button>{courseToPreview?.price}$</button> */}
                </h4>
                <p>{courseToPreview?.courseSubTitle}</p>
                <hr />
                <div className="course-content">
                  <h5>
                    {t("courseDetails.duration")}:
                    <span>
                      {courseToPreview?.duration.value}{" "}
                      {courseToPreview?.duration.unit}
                    </span>{" "}
                  </h5>
                </div>
              </div>
              <div className="course-content">
                <h5>
                  {t("courseDetails.level")} :{" "}
                  <span> {courseToPreview?.level}</span>
                </h5>
              </div>
              <div className="course-content">
                <h5>{t("courseDetails.aboutCourse")} </h5>
                <p>{courseToPreview?.description}</p>
              </div>
              <hr />
              <div className="course-content">
                <h5>{userExists ? t("Rate.yourRate") : t("Rate.addRate")} </h5>
                <Row
                  aria-disabled
                  className="d-flex justify-content-start align-items-start"
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <Rating
                    disabled={!editRate || userExists}
                    style={{ width: "fit-content", outline: "none" }}
                    value={userRate ? userRate : rate}
                    onChange={(e) => handleRatingChange(e.value)}
                    cancel={false}
                  />
                  {userRate
                    ? userRate
                    : rate && (
                        <span
                          style={{
                            margin: "0",
                            fontSize: "20px",
                            width: "20%",
                          }}
                        >
                          {userRate ? userRate : rate}
                        </span>
                      )}
                </Row>
              </div>

              <Row className="addRate__btns gap-2">
                {showConfirmation && (
                  <>
                    <Button
                      variant="primary"
                      type="submit"
                      // style={{
                      //   margin: "10px",
                      //   width: "fit-content",
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      //   gap: "2px",
                      //   color: "#f4f4f4",
                      //   padding: "10px 20px",
                      //   textDecoration: "none",
                      //   borderRadius: "5px",
                      // }}
                      className="btn btn-primary"
                      onClick={handleConfirmRate}
                    >
                      Confirm Rate
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      // style={{
                      //   width: "fit-content",
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      //   gap: "2px",
                      //   color: "#f4f4f4",
                      //   margin: "16px",
                      //   padding: "10px 20px",
                      //   textDecoration: "none",
                      //   borderRadius: "5px",
                      // }}
                      onClick={handleCancelRate}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Row>
            </div>
          </div>
        </Col>

        <Col lg={6} md={6} sm={12}>
          <div className="learn">
            <div className="course-content">
              <h5 className="mb-4">{t("courseDetails.whatYouWillLearn")}</h5>
              <ul>
                {courseToPreview?.whatUWillLearn.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <hr />
            <div className="button-course-det">
              <a
                href={courseToPreview?.link}
                target="_blank"
                style={{
                  marginLeft: "0",
                  backgroundColor: "rgb(245,183,67)",
                  color: "#333",
                  padding: "10px 20px",
                  textDecoration: "none",
                  borderRadius: "5px",
                }}
                rel="noreferrer"
              >
                {t("courseDetails.link")}
              </a>
              <span
                className="mx-3"
                style={{ cursor: "pointer" }}
                onClick={() => toggleCourseToWhishList(courseToPreview?._id)}
              >
                {index !== -1 ? "Remove from Favorite" : "Add to Favorite"}
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CourseDetails;
