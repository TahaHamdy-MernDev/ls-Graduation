import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CommentSection from "./CommentSection";
import Subsection from "./Subsection";
import Form from "./Form";
import { useDispatch } from "react-redux";
import {
  askQuestionAction,
  fetchQuestionsAction,
} from "../Redux/Action/questionAction";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { currentUserAction } from "../Redux/Action/userAction";
import { useTranslation } from "react-i18next";

function Ques() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const { questions } = useSelector((state) => state.question);

  useEffect(() => {
    dispatch(fetchQuestionsAction());
  }, [dispatch]);

  const handleCommentSubmit = async (question) => {
    dispatch(askQuestionAction(question))
      .unwrap()
      .then(() => {
        dispatch(fetchQuestionsAction());
      });
    setComment(" ");
  };
  const navigate = useNavigate();
  const handleQuestionPreview = (questionId) => {
    // Add navigation logic to preview question page
    navigate(`/question-preview/${questionId}`);
  };
  const userContributions = {};

  questions?.forEach((question) => {
    const userId = question.user?._id;

    if (!userContributions[userId]) {
      userContributions[userId] = {
        userData: question.user,
        questions: 1,
        answers: 0,
      };
    } else {
      userContributions[userId].questions += 1;
    }

    // Calculate user contributions from answers
    question.answers.forEach((answer) => {
      const answerUserId = answer.user._id;

      if (!userContributions[answerUserId]) {
        userContributions[answerUserId] = {
          userData: answer.user,
          questions: 0,
          answers: 1,
        };
      } else {
        userContributions[answerUserId].answers += 1;
      }
    });
  });
  const userContributionsArray = Object.values(userContributions);
  userContributionsArray.sort(
    (a, b) => b.questions + b.answers - (a.questions + a.answers)
  );

  const top5UserContributions = userContributionsArray.slice(0, 5);
  const { t } = useTranslation();
  const maxLength = 150;
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(currentUserAction());
  }, [dispatch]);
  return (
    <Container className="mt-4">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="header-ques">
            <div>
              <h3>{t("questionSection.any your question?")}</h3>
              <span>{t("questionSection.join here")}</span>
            </div>
            <img src="../src/images/ques.jpg" alt="logo" />
          </div>
        </Col>

        <div className="question-sec">
          <h4>{t("programmingQuestionsPage.pageTitle")}</h4>
          <p>{t("programmingQuestionsPage.pageDescription")}</p>
        </div>
        <hr className="mt-4" />
        <Col lg={6} md={12} className="mt-4">
          <div className="users-card-container">
            {questions?.length > 0 ? (
              questions.map((question, index) => (
                <Row key={index} className="mb-3 border p-3 rounded">
                  <Col>
                    <div className="users-card">
                      <div>
                        <span
                          onClick={() => handleQuestionPreview(question._id)}
                          style={{ cursor: "pointer" }}
                          className="text-users text-muted d-flex col justify-content-between"
                        >
                          <span>
                            <p className="mb-1">
                              {question?.text.length > maxLength ? (
                                <>
                                  {question?.text.slice(0, maxLength)}
                                  {"... "}
                                  <span
                                    className="text-primary"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {t("programmingQuestionsPage.readMore")}
                                  </span>
                                </>
                              ) : (
                                <>{question.text}</>
                              )}
                            </p>
                            <p>
                              {question.answers.length}{" "}
                              {t("programmingQuestionsPage.numberOfAnswers")} |{" "}
                              {question.votes.length}{" "}
                              {t("programmingQuestionsPage.numberOfVotes")}
                            </p>
                            &bull; {t("programmingQuestionsPage.questions")}{" "}
                            <strong>
                              {question.user?.firstName || question.firstName}{" "}
                              {question.user?.lastName || question.lastName}
                            </strong>{" "}
                            {t("bookTable.at")}{" "}
                            {new Date(question.createdAt).toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <Link to={`/profile/${question?.user?._id}`}>
                        <img
                          title="show profile"
                          src={question?.user?.profileImage.url}
                        />
                      </Link>
                    </div>
                  </Col>
                </Row>
              ))
            ) : (
              <h3>{t("programmingQuestionsPage.noQuestionsMessage")}</h3>
            )}
            <hr className="my-4" />

            <CommentSection
              placeholder={t("programmingQuestionsPage.addQuestionPlaceholder")}
              buttonText={t("programmingQuestionsPage.addQuestionButtonText")}
              comment={comment}
              onCommentChange={(e) => setComment(e.target.value)}
              onCommentSubmit={handleCommentSubmit}
            />
          </div>
        </Col>
        <Col lg={6} md={12} className="mb-4">
          <div className="famous-user p-4">
            <h4>{t("programmingQuestionsPage.contributorsTitle")}</h4>

            <ul>
              {Object.keys(top5UserContributions).map((userId) => {
                const userContribution = top5UserContributions[userId];
                if (userContribution.userData) {
                  return (
                    <Row key={userId} className="my-3 border p-3 rounded">
                      <div className="users-card">
                        <div>
                          <span>
                            <strong>
                              {userContribution.userData.firstName}{" "}
                              {userContribution.userData.lastName}
                            </strong>
                            <br />
                            {t("programmingQuestionsPage.questions")}:{" "}
                            {userContribution.questions} |{" "}
                            {t("programmingQuestionsPage.answers")}:{" "}
                            {userContribution.answers}
                          </span>
                        </div>
                        <Link to={`/profile/${userContribution.userData?._id}`}>
                          <img
                            src={userContribution.userData.profileImage.url}
                          />
                        </Link>
                      </div>
                    </Row>
                  );
                }

                return null;
              })}
            </ul>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <h4 className="title-subsection">
            {t("programmingQuestionsPage.sectionSubTitle")}
          </h4>
          <Subsection />
          <Subsection />
          <Subsection />
          <Subsection />
        </Col>
      </Row>
      {!currentUser && (
        <Row>
          <Col md={12}>
            <Form />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Ques;
