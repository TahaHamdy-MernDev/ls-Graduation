/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import { useDispatch } from "react-redux";
import {
  addCommentBookAction,
  getAllBookAction,
  downloadsCountAction,
  updateBookRateByIdAction,
} from "../../Redux/Action/bookAction";
import CommentSection from "../commentSection";
import DownloadButton from "../DownloadButton";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  currentUserAction,
  toggleBookToWishlistAction,
} from "../../Redux/Action/userAction";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { Rating } from "primereact/rating";
import { FaRegStar } from "react-icons/fa";
const BookDetailPage = () => {
  const { id: bookId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllBookAction());
    dispatch(currentUserAction());
  }, [dispatch]);

  const bookToPreview = useSelector((state) =>
    state.book.books.find((book) => book._id === bookId)
  );
  const [comment, setComment] = useState("");
  const downloadPDF = async (pdfUrl) => {
    try {
      dispatch(downloadsCountAction({ bookId: bookToPreview._id }));
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${bookToPreview?.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleCommentSubmit = async (Comment) => {
    dispatch(
      addCommentBookAction({ bookId: bookToPreview?._id, comment: Comment })
    )
      .unwrap()
      .then(() => {
        dispatch(getAllBookAction());
        setComment("");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const { t } = useTranslation();
  const coverImage = `${bookToPreview?.coverImage.url}`;
  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 3600; // 60 * 60
  const SECONDS_IN_DAY = 86400; // 24 * 60 * 60
  const SECONDS_IN_MONTH = 2592000; // 30 * 24 * 60 * 60
  const SECONDS_IN_YEAR = 31536000; // 365 * 24 * 60 * 60

  const formatTimeAgo = (createdAt) => {
    const now = moment();
    const commentTime = moment(createdAt);
    const diffInSeconds = now.diff(commentTime, "seconds");

    if (diffInSeconds < SECONDS_IN_MINUTE) {
      return t("timeAgo.now");
    } else if (diffInSeconds < SECONDS_IN_HOUR) {
      const diffInMinutes = Math.floor(diffInSeconds / SECONDS_IN_MINUTE);
      return t("timeAgo.minutesAgo", { count: diffInMinutes });
    } else if (diffInSeconds < SECONDS_IN_DAY) {
      const diffInHours = Math.floor(diffInSeconds / SECONDS_IN_HOUR);
      return t("timeAgo.hoursAgo", { count: diffInHours });
    } else if (diffInSeconds < SECONDS_IN_MONTH) {
      const diffInDays = Math.floor(diffInSeconds / SECONDS_IN_DAY);
      return t("timeAgo.daysAgo", { count: diffInDays });
    } else if (diffInSeconds < SECONDS_IN_YEAR) {
      const diffInMonths = Math.floor(diffInSeconds / SECONDS_IN_MONTH);
      return t("timeAgo.monthsAgo", { count: diffInMonths });
    } else {
      const diffInYears = Math.floor(diffInSeconds / SECONDS_IN_YEAR);
      return t("timeAgo.yearsAgo", { count: diffInYears });
    }
  };
  const userExists = bookToPreview?.ratings.some(
    (rating) => rating?.user === currentUser?._id
  );
  const userRate = userExists
    ? bookToPreview?.ratings?.find((rating) => rating.user === currentUser?._id)
        .rating
    : null;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editRate, setEditRate] = useState(true);
  const [rate, setRate] = useState(0);

  const handleRatingChange = (newRating) => {
    setRate(newRating);
    setShowConfirmation(true);
  };

  const handleConfirmRate = () => {
    setShowConfirmation(false);
    dispatch(updateBookRateByIdAction({ _id: bookToPreview._id, rating: rate }))
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


  const toggleBookToWhishList = (id) => {
   
    dispatch(toggleBookToWishlistAction(id))
      .unwrap()
      .then(() => {
        dispatch(currentUserAction());
      })
    
  };
  const index = currentUser?.bookWishlist.findIndex(
    (bookObj) => bookObj._id.toString() === bookToPreview?._id.toString()
  );
  return (
    <Container dir={i18n.dir()}>
      <Row className="mt-5">
        <Col lg={6} md={12}>
          {bookToPreview ? (
            <>
              <div className="book-det">
                <h2 className="title-det">
                  {bookToPreview.title}{" "}
                  <span style={{ color: "rgb(245,183,67)" }}>
                    {calculateAverageRating(bookToPreview?.ratings)}{" "}
                    <FaRegStar style={{ fill: "black" }} />
                  </span>
                </h2>
                <img
                  src={coverImage}
                  alt={bookToPreview.title}
                  className="img-fluid mb-3"
                />
                <p>{bookToPreview?.description}</p>
                <p className="para-book">
                  {t("bookPreview.author")}: {bookToPreview?.author}
                </p>
                <p>
                  {t("bookPreview.downloads")}: {bookToPreview?.downloads}
                </p>
              </div>

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
                            fontSize: "17px",
                            width: "20%",
                          }}
                        >
                          {userRate ? userRate : rate}
                        </span>
                      )}
                </Row>
                <Row className="all-btn">
                  {showConfirmation && (
                    <>
                      <Button
                        variant="primary"
                        type="submit"
                        style={{
                          margin: "10px",
                          width: "fit-content",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "2px",
                          color: "#f4f4f4",
                          padding: "10px 20px",
                          textDecoration: "none",
                          borderRadius: "5px",
                        }}
                        onClick={handleConfirmRate}
                      >
                        Confirm Rate
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        style={{
                          width: "fit-content",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "2px",
                          color: "#f4f4f4",
                          margin: "10px",
                          padding: "10px 20px",
                          textDecoration: "none",
                          borderRadius: "5px",
                        }}
                        onClick={handleCancelRate}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </Row>
              </div>
          
              <h4 className=" title-btn mt-4">
                {t("bookPreview.downloadBook")}
              </h4>
               <DownloadButton
                onDownloadClick={() => downloadPDF(bookToPreview?.file.url)}
              />
              <span
                className=" mx-3"
                style={{ cursor: "pointer" }}
                onClick={() => toggleBookToWhishList(bookToPreview._id)}
              >
                {index !== -1 ? "Remove from Favorite" : "Add to Favorite"}
              </span>
               </>
          ) : (
            <p>{t("bookPreview.bookNotSelected")}</p>
          )}
        </Col>

        <Col lg={6} md={12}>
          {bookToPreview ? (
            <>
              <h4 className="title-btn mt-4">
                {t("bookPreview.readerComments")}
              </h4>
              <div className="right-side-comment">
                {bookToPreview.reviews.length > 0 ? (
                  <>
                    {bookToPreview.reviews
                      .filter((review) => review.text !== undefined)
                      .map((review, index) => (
                        <div key={index} className="mb-3 border p-3 rounded">
                          <span className="text-muted mb-2 d-flex justify-content-between">
                          <span className="d-flex">
                        <Link to={`/profile/${review?.user?._id}`}>
                          <img
                           title="show profile"
                            src={review?.user?.profileImage.url}
                            width={"40"}
                          />
                        </Link>
                        <strong>
                          <p>
                            {review.user.firstName} {review.user.lastName}
                          </p>
                        </strong>{" "}
                      </span>
                            &bull; {formatTimeAgo(review?.createdAt)}
                          </span>
                          <p className="mb-0">{review.text}</p>
                        </div>
                      ))}
                  </>
                ) : (
                  <p>{t("bookPreview.noReviews")}</p>
                )}
              </div>
            </>
          ) : (
            <p>{t("bookPreview.bookNotSelected")}</p>
          )}
          {currentUser && (
            <>
              <h4 className=" title-btn mt-4">
                {t("bookPreview.readerComments")}
              </h4>
              <CommentSection
                comment={comment}
                buttonText={t("bookPreview.addComment")}
                placeholder={t("bookPreview.commentPlaceholder")}
                onCommentChange={(e) => setComment(e.target.value)}
                onCommentSubmit={handleCommentSubmit}
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetailPage;
