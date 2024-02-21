import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  upVoteQuestionAction,
  addAnswerAction,
  fetchQuestionsAction,
  upVoteAnswerAction,
} from "../Redux/Action/questionAction";
import moment from "moment";
import { toast } from "react-toastify";
import { currentUserAction } from "../Redux/Action/userAction";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const QuestionPreview = () => {
  const dispatch = useDispatch();
  const { id: questionId } = useParams();
  const [reply, setReply] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(fetchQuestionsAction());
    dispatch(currentUserAction());
  }, [dispatch]);

  const question = useSelector((state) =>
    state.question.questions.find((question) => question._id === questionId)
  );

  const handleVoteAnswer = (id) => {
    dispatch(upVoteAnswerAction({ questionId: question._id, answerId: id }))
      .unwrap()
      .then(() => {
        dispatch(fetchQuestionsAction());
      })
      .catch((err) => {
        toast.warn(err.message);
      });
    // Implement the logic to vote for the question
  };
  const handleQuestionVote = () => {
    dispatch(upVoteQuestionAction(question._id))
      .unwrap()
      .then(() => {
        dispatch(fetchQuestionsAction());
      })
      .catch((err) => {
        toast.warn(err.message);
      });
  };
  const handleReply = () => {
    setShowReplyInput(true);
  };

  const handleReplySubmit = () => {
    if (reply.trim() !== "") {
      // Dispatch action to add the reply
      dispatch(addAnswerAction({ _id: questionId, reply })).then(() => {
        dispatch(fetchQuestionsAction());
      });

      setReply("");
      setShowReplyInput(false);
    }
  };
  const formatTimeAgo = (createdAt) => {
    const now = moment();
    const commentTime = moment(createdAt);
    const diffInSeconds = now.diff(commentTime, "seconds");

    if (diffInSeconds < 60) {
      return t("timeAgo.now");
    } else if (diffInSeconds < 60 * 60) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return t("timeAgo.minutesAgo", { count: diffInMinutes });
    } else if (diffInSeconds < 24 * 60 * 60) {
      const diffInHours = Math.floor(diffInSeconds / (60 * 60));
      return t("timeAgo.hoursAgo", { count: diffInHours });
    } else if (diffInSeconds < 24 * 60 * 30 * 60) {
      const diffInDays = Math.floor(diffInSeconds / (24 * 60 * 60));
      return t("timeAgo.daysAgo", { count: diffInDays });
    } else if (diffInSeconds < 24 * 60 * 30 * 12 * 60) {
      const diffInMonths = Math.floor(diffInSeconds / (24 * 60 * 30 * 60));
      return t("timeAgo.monthsAgo", { count: diffInMonths });
    } else {
      const diffInYears = Math.floor(diffInSeconds / (24 * 60 * 30 * 12 * 60));
      return t("timeAgo.yearsAgo", { count: diffInYears });
    }
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <Row
      className="mb-3 border p-3 rounded"
      // dir={i18n.dir()}
    >
      <Col lg={6} md={12}>
        <div className="comment-container">
          <h4 className="title-comment mt-4">
            {t("questionSection.question")}
          </h4>
          <div>
            <p className="mb-1">{question?.text}</p>
            <p>
              {question?.answers.length} {t("questionSection.reply's")} |{" "}
              {question?.votes.length} {t("questionSection.vote")}
            </p>
            &bull;{t("questionSection.by")}{" "}
            <strong>
              {question?.user?.firstName || question.firstName}{" "}
              {question?.user?.lastName || question.lastName}
            </strong>{" "}
            {t("questionSection.in")}{" "}
            {new Date(question?.createdAt).toLocaleString()}
          </div>

          {currentUser && (
            <>
              <div className="mt-3">
                <Button
                  color="primary"
                  disabled={question.votes.some(
                    (vote) =>
                      vote.user.toString() === currentUser._id.toString()
                  )}
                  onClick={handleQuestionVote}
                >
                  {t("questionSection.vote")}
                </Button>{" "}
                <Button color="info" onClick={handleReply}>
                  {t("questionSection.reply")}
                </Button>
              </div>
              {showReplyInput && (
                <Form.Group className="mt-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder={t("questionSection.addReply")}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <Button className="mt-2" onClick={handleReplySubmit}>
                    {t("questionSection.sendReply")}
                  </Button>
                </Form.Group>
              )}
            </>
          )}
        </div>
      </Col>

      <Col lg={6} md={12}>
        {question ? (
          <>
            <div className="comment-container">
              <h4 className="mt-4">{t("questionSection.answers")}</h4>
              {question.answers.length > 0 ? (
                question.answers.map((answer, index) => (
                  <div key={index} className="mb-3 border p-3 rounded">
                    <span className="text-muted mb-2 d-flex justify-content-between">
                      <span className="d-flex">
                        <Link to={`/profile/${answer?.user?._id}`}>
                          <img
                          title="show profile"
                            src={answer?.user?.profileImage.url}
                            width={"40"}
                          />
                        </Link>
                        <strong>
                          <p>
                            {answer.user.firstName} {answer.user.lastName}
                          </p>
                        </strong>{" "}
                      </span>
                      &bull; {formatTimeAgo(answer.createdAt)}
                    </span>
                    <p className="mb-0">{answer.text}</p>
                    <span className="d-flex justify-content-between align-items-center">
                      {currentUser && (
                        <Button
                          color="primary"
                          className="mt-2"
                          onClick={() => handleVoteAnswer(answer._id)}
                          disabled={question?.answers?.some((answer) =>
                            answer.votes?.some(
                              (vote) =>
                                vote.user?._id.toString() ===
                                currentUser?._id.toString()
                            )
                          )}
                        >
                          {t("questionSection.vote")}
                        </Button>
                      )}
                      | {answer?.votes.length} {t("questionSection.vote")}
                    </span>
                  </div>
                ))
              ) : (
                <p>{t("questionSection.noAnswers")}</p>
              )}
            </div>
          </>
        ) : null}
      </Col>
    </Row>
  );
};

export default QuestionPreview;
